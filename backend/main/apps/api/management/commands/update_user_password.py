from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Updates the admin user password to meet validation requirements'

    def handle(self, *args, **options):
        try:
            # Find the admin user
            user = User.objects.get(username='admin')
            
            # New password that meets all validation requirements:
            # - At least 8 characters ✓
            # - Uppercase letter ✓
            # - Lowercase letter ✓
            # - Number ✓
            # - Special character ✓
            new_password = 'Admin123!'
            
            # Update the password
            user.set_password(new_password)
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully updated password for user "{user.username}"\n'
                    f'New password: {new_password}\n'
                    f'This password meets all validation requirements:'
                    f'\n- 8+ characters: ✓'
                    f'\n- Uppercase letter: ✓'
                    f'\n- Lowercase letter: ✓'
                    f'\n- Number: ✓'
                    f'\n- Special character: ✓'
                )
            )
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR('User "admin" not found. Please create the user first.')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error updating password: {e}')
            )
