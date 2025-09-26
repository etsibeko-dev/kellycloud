from django.db import models
from django.contrib.auth.models import User
import os

def user_directory_path(instance, filename):
    """Generate file path for user uploads"""
    return f'uploads/user_{instance.owner.id}/{filename}'

class File(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    file_type = models.CharField(max_length=100)
    file_size = models.BigIntegerField(default=0)  # File size in bytes
    file = models.FileField(upload_to=user_directory_path, blank=True, null=True)  # Actual file

    def __str__(self):
        return self.name
    
    @property
    def size_mb(self):
        """Get file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    def save(self, *args, **kwargs):
        # Update file_size when file is saved
        if self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
