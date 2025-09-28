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
    download_count = models.PositiveIntegerField(default=0)  # Track downloads
    last_downloaded = models.DateTimeField(null=True, blank=True)  # Last download timestamp
    is_deleted = models.BooleanField(default=False)  # Soft delete flag
    deleted_date = models.DateTimeField(null=True, blank=True)  # When it was deleted

    def __str__(self):
        return self.name
    
    @property
    def size_mb(self):
        """Get file size in MB"""
        return round(self.file_size / (1024 * 1024), 2)
    
    def increment_download_count(self):
        """Increment download count and update last downloaded timestamp"""
        from django.utils import timezone
        self.download_count += 1
        self.last_downloaded = timezone.now()
        self.save(update_fields=['download_count', 'last_downloaded'])
    
    def soft_delete(self):
        """Mark file as deleted without removing from database"""
        from django.utils import timezone
        self.is_deleted = True
        self.deleted_date = timezone.now()
        self.save(update_fields=['is_deleted', 'deleted_date'])
    
    def save(self, *args, **kwargs):
        # Update file_size and file_type when file is saved
        if self.file:
            self.file_size = self.file.size
            # Extract file type from filename if not provided
            if not self.file_type:
                try:
                    ext = os.path.splitext(self.file.name)[1]
                    if ext:
                        self.file_type = ext[1:].lower()  # Remove the dot and convert to lowercase
                    else:
                        self.file_type = 'unknown'
                except:
                    self.file_type = 'unknown'
        super().save(*args, **kwargs)
