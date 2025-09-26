from django.db import models
from django.contrib.auth.models import User

class File(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=100)

    def __str__(self):
        return self.name
