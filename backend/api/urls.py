from django.urls import path
from .views import RegisterView, LoginView, LogoutView, FileListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='api_register'),
    path('login/', LoginView.as_view(), name='api_login'),
    path('logout/', LogoutView.as_view(), name='api_logout'),
    path('files/', FileListView.as_view(), name='api_files'),
]
