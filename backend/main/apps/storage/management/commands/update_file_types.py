from django.core.management.base import BaseCommand
from apps.storage.models import File
import os

class Command(BaseCommand):
    help = 'Update file types for existing files based on their filenames'

    def handle(self, *args, **options):
        files = File.objects.all()
        updated_count = 0
        
        for file in files:
            if file.name and not file.file_type:
                # Extract file type from filename
                try:
                    ext = os.path.splitext(file.name)[1]
                    if ext:
                        file.file_type = ext[1:].lower()  # Remove the dot and convert to lowercase
                        file.save()
                        updated_count += 1
                        self.stdout.write(f'Updated {file.name} -> {file.file_type}')
                    else:
                        file.file_type = 'unknown'
                        file.save()
                        updated_count += 1
                        self.stdout.write(f'Updated {file.name} -> unknown')
                except Exception as e:
                    self.stdout.write(f'Error updating {file.name}: {e}')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} files')
        )
