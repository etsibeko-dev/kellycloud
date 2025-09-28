from rest_framework import serializers
from django.contrib.auth.models import User
from apps.storage.models import File
from .models import Subscription, UserSubscription

class UserSerializer(serializers.ModelSerializer):
    subscription_info = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'subscription_info']
    
    def get_subscription_info(self, obj):
        try:
            user_sub = obj.subscription
            return {
                'plan_type': user_sub.plan_type,
                'plan_display': user_sub.get_plan_type_display(),
                'storage_limit_gb': Subscription.get_plan(user_sub.plan_type)['storage_limit_gb'],
                'current_usage_bytes': user_sub.current_usage_bytes,
                'usage_percentage': round(user_sub.usage_percentage, 2)
            }
        except UserSubscription.DoesNotExist:
            return {
                'plan_type': 'basic',
                'plan_display': 'Basic',
                'storage_limit_gb': 50,
                'current_usage_bytes': 0,
                'usage_percentage': 0
            }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Create default basic subscription
        UserSubscription.objects.create(user=user, plan_type='basic')
        return user

class FileSerializer(serializers.ModelSerializer):
    size_mb = serializers.ReadOnlyField()
    
    class Meta:
        model = File
        fields = ['id', 'name', 'upload_date', 'file_type', 'file_size', 'size_mb', 'file', 
                 'download_count', 'last_downloaded', 'is_deleted', 'deleted_date']
        read_only_fields = ['owner', 'upload_date', 'file_size', 'file_type', 'download_count', 
                           'last_downloaded', 'is_deleted', 'deleted_date']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'

class UserSubscriptionSerializer(serializers.ModelSerializer):
    storage_info = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSubscription
        fields = '__all__'
        read_only_fields = ['user', 'start_date']
    
    def get_storage_info(self, obj):
        return {
            'limit_bytes': obj.storage_limit_bytes,
            'limit_gb': Subscription.get_plan(obj.plan_type)['storage_limit_gb'],
            'current_usage_bytes': obj.current_usage_bytes,
            'usage_percentage': round(obj.usage_percentage, 2)
        }
