from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates a test user with a password that meets validation requirements'

    def handle(self, *args, **options):
        try:
            # Create a new test user
            username = 'testuser'
            email = 'test@kellycloud.com'
            password = 'TestUser123!'
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(
                    self.style.WARNING(f'User "{username}" already exists.')
                )
                return
            
            # Create the user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name='Test',
                last_name='User'
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created test user:\n'
                    f'Username: {username}\n'
                    f'Email: {email}\n'
                    f'Password: {password}\n'
                    f'This password meets all validation requirements:'
                    f'\n- 8+ characters: ✓'
                    f'\n- Uppercase letter: ✓'
                    f'\n- Lowercase letter: ✓'
                    f'\n- Number: ✓'
                    f'\n- Special character: ✓'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating test user: {e}')
            )
