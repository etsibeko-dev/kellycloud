from django.urls import path

from . import views

app_name = "landingpage_CLOUD"
urlpatterns = [
    path("", views.index, name="index"),
    
]