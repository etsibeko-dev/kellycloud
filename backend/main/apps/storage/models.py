from django.db import models
from django.contrib.auth.models import User

class File(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=100)
    file_size = models.BigIntegerField(default=0)  # File size in bytes
    file_path = models.CharField(max_length=500, blank=True)  # Path to actual file

    def __str__(self):
        return self.name
    
    @property
    def size_mb(self):
        """Get file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
