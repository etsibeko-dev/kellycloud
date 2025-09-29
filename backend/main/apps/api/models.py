from django.db import models
from django.contrib.auth.models import User

class Subscription(models.Model):
    PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]
    
    plan_type = models.CharField(max_length=20, choices=PLAN_CHOICES, default='basic')
    storage_limit_gb = models.IntegerField(default=50)  # Storage limit in GB
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    features = models.JSONField(default=dict)  # Store plan features as JSON
    
    def __str__(self):
        return f"{self.get_plan_type_display()} - {self.storage_limit_gb}GB"
    
    @classmethod
    def get_plan(cls, plan_type):
        """Get subscription plan by type"""
        plans = {
            'basic': {
                'storage_limit_gb': 50,
                'price_monthly': 50.00,
                'features': {
                    'storage': '50 GB Storage',
                    'features': 'Essential Cloud Features',
                    'security': 'Basic Data Protection',
                    'speed': 'Standard Access Speed',
                    'support': 'Email Support',
                    'versioning': 'Limited File Versioning'
                }
            },
            'standard': {
                'storage_limit_gb': 500,
                'price_monthly': 150.00,
                'features': {
                    'storage': '500 GB Storage',
                    'features': 'All Basic Features + Advanced Tools',
                    'security': 'Advanced Data Encryption',
                    'speed': 'High-Speed Access & Scalability',
                    'support': 'Priority Email Support',
                    'versioning': 'File Versioning'
                }
            },
            'premium': {
                'storage_limit_gb': 2048,  # 2TB
                'price_monthly': 300.00,
                'features': {
                    'storage': '2 TB Storage',
                    'features': 'All Standard Features + Premium Tools',
                    'security': 'Security & Compliance',
                    'speed': 'Ultra-Fast Performance & Scalability',
                    'support': '24/7 Phone & Email Support',
                    'versioning': 'Team Collaboration Tools'
                }
            }
        }
        return plans.get(plan_type, plans['basic'])

class UserSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan_type = models.CharField(max_length=20, choices=Subscription.PLAN_CHOICES, default='basic')
    start_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    current_usage_bytes = models.BigIntegerField(default=0)  # Track actual storage usage
    
    def __str__(self):
        return f"{self.user.username} - {self.get_plan_type_display()}"
    
    @property
    def storage_limit_bytes(self):
        """Get storage limit in bytes"""
        plan = Subscription.get_plan(self.plan_type)
        return plan['storage_limit_gb'] * 1024 * 1024 * 1024  # Convert GB to bytes
    
    @property
    def usage_percentage(self):
        """Get storage usage as percentage"""
        if self.storage_limit_bytes == 0:
            return 0
        return (self.current_usage_bytes / self.storage_limit_bytes) * 100
