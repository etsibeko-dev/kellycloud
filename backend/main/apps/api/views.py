from rest_framework import generics, permissions, status, throttling
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, Http404, FileResponse
import os
from django.utils import timezone
from .serializers import UserSerializer, RegisterSerializer, FileSerializer, SubscriptionSerializer, UserSubscriptionSerializer
from .models import Subscription, UserSubscription
from apps.storage.models import File

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=400)
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=400)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        logout(request)
        return Response({'message': 'Logged out successfully'})

class FileListCreateView(generics.ListCreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [throttling.UserRateThrottle]
    
    def get_queryset(self):
        return File.objects.filter(owner=self.request.user, is_deleted=False)
    
    def perform_create(self, serializer):
        # Check storage limits before creating file
        try:
            user_sub = self.request.user.subscription
            # Get actual file size from uploaded file
            uploaded_file = self.request.FILES.get('file')
            if uploaded_file:
                # Basic file validation for concept
                allowed_exts = {'.pdf', '.csv', '.txt', '.md', '.jpeg', '.jpg', '.png', '.gif', '.mp4', '.mov', '.avi', '.mkv', '.appimage'}
                name_lower = uploaded_file.name.lower()
                _, ext = os.path.splitext(name_lower)
                if ext not in allowed_exts:
                    raise Exception("File type not allowed")
                max_bytes = 1024 * 1024 * 1024  # 1 GB per file cap for demo
                if uploaded_file.size > max_bytes:
                    raise Exception("File exceeds max allowed size (1GB)")
                estimated_size = uploaded_file.size
            else:
                # Fallback for demo files without actual upload
                estimated_size = 1024 * 1024  # 1MB
                
            if user_sub.current_usage_bytes + estimated_size > user_sub.storage_limit_bytes:
                raise Exception("Storage limit exceeded. Please upgrade your plan.")
        except UserSubscription.DoesNotExist:
            # Create basic subscription if none exists
            user_sub = UserSubscription.objects.create(user=self.request.user, plan_type='basic')
        
        # Save the file with owner
        file_instance = serializer.save(owner=self.request.user)
        
        # Update user's storage usage
        if file_instance.file_size > 0:
            user_sub.current_usage_bytes += file_instance.file_size
            user_sub.save()

class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return File.objects.filter(owner=self.request.user, is_deleted=False)
    
    def perform_destroy(self, instance):
        # Update user's storage usage when file is deleted
        try:
            user_sub = self.request.user.subscription
            user_sub.current_usage_bytes = max(0, user_sub.current_usage_bytes - instance.file_size)
            user_sub.save()
        except:
            pass  # If subscription doesn't exist, just soft delete the file
        # Use soft delete instead of hard delete
        instance.soft_delete()

class FileDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [throttling.UserRateThrottle]
    
    def get(self, request, pk):
        try:
            file_obj = File.objects.get(pk=pk, owner=request.user, is_deleted=False)
            
            # Increment download count
            file_obj.increment_download_count()
            
            # Determine a precise filename (include extension)
            stored_name = os.path.basename(file_obj.file.name)  # e.g. uploads/user_1/foo.pdf -> foo.pdf
            stored_ext = os.path.splitext(stored_name)[1]
            download_name = file_obj.name or stored_name
            # Ensure extension present
            base_name = os.path.basename(download_name)
            if not os.path.splitext(base_name)[1] and stored_ext:
                download_name = f"{download_name}{stored_ext}"

            # Stream file to client with correct filename
            file_obj.file.open('rb')
            response = FileResponse(file_obj.file, as_attachment=True, filename=download_name)
            # Optional: explicit content type fallback
            if 'Content-Type' not in response:
                response['Content-Type'] = 'application/octet-stream'
            # Expose Content-Disposition so frontend (different origin) can read filename
            response['Access-Control-Expose-Headers'] = 'Content-Disposition'
            return response
            
        except File.DoesNotExist:
            raise Http404("File not found")

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get analytics data for the user"""
        user_files = File.objects.filter(owner=request.user)
        
        # Calculate analytics
        total_uploaded = user_files.count()
        total_downloaded = sum(file.download_count for file in user_files)
        total_deleted = user_files.filter(is_deleted=True).count()
        
        # Calculate unique active days
        upload_dates = user_files.values_list('upload_date', flat=True)
        unique_days = set(date.date() for date in upload_dates)
        active_days = len(unique_days)
        
        return Response({
            'uploaded': total_uploaded,
            'downloaded': total_downloaded,
            'deleted': total_deleted,
            'active_days': active_days
        })

class SubscriptionListView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        plans = ['basic', 'standard', 'premium']
        subscription_data = []
        for plan in plans:
            plan_info = Subscription.get_plan(plan)
            subscription_data.append({
                'plan_type': plan,
                'plan_display': plan.title(),  # Basic, Standard, Premium
                'storage_limit_gb': plan_info['storage_limit_gb'],
                'price_monthly': plan_info['price_monthly'],
                'features': plan_info['features']
            })
        return Response(subscription_data)

class UserSubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Get or create basic subscription if none exists
        user_sub, created = UserSubscription.objects.get_or_create(
            user=request.user, 
            defaults={'plan_type': 'basic'}
        )
        serializer = UserSubscriptionSerializer(user_sub)
        return Response(serializer.data)
    
    def post(self, request):
        plan_type = request.data.get('plan_type')
        if plan_type not in ['basic', 'standard', 'premium']:
            return Response({'error': 'Invalid plan type'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_sub = request.user.subscription
            user_sub.plan_type = plan_type
            user_sub.save()
        except UserSubscription.DoesNotExist:
            user_sub = UserSubscription.objects.create(user=request.user, plan_type=plan_type)
        
        serializer = UserSubscriptionSerializer(user_sub)
        return Response(serializer.data)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get current user profile data"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        """Update user profile data"""
        user = request.user
        data = request.data
        
        # Update user fields
        if 'email' in data:
            user.email = data['email']
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        try:
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
