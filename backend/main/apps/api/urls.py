from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('files/', views.FileListCreateView.as_view(), name='file-list'),
    path('files/<int:pk>/', views.FileDetailView.as_view(), name='file-detail'),
    path('subscriptions/', views.SubscriptionListView.as_view(), name='subscription-list'),
    path('user-subscription/', views.UserSubscriptionView.as_view(), name='user-subscription'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]
