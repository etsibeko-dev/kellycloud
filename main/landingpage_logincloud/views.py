from django.shortcuts import render
from django.contrib.auth.views import LoginView, LogoutView

class UserLoginView(LoginView):
    template_name = 'landingpage_logincloud/login.html'

class UserLogoutView(LogoutView):
    pass
