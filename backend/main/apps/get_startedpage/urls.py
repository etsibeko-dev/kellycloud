from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_started, name='get_started'),
    path('register/', views.register, name='register'),
]