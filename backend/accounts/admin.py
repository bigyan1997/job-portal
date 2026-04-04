from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'phone', 'city', 'country', 'is_active', 'date_joined']
    list_filter = ['role', 'is_staff', 'is_active', 'country']
    search_fields = ['email', 'full_name', 'phone', 'city']

    fieldsets = (
        ('Login Info', {'fields': ('email', 'password')}),

        # shown for both roles
        ('Personal / Contact Info', {'fields': (
            'full_name', 'company_name', 'phone', 'avatar', 'resume'
        )}),

        ('Location', {'fields': (
            'address', 'city', 'state', 'country'
        )}),

        ('About', {'fields': ('bio',)}),

        ('Online Presence', {'fields': ('linkedin', 'portfolio')}),

        ('Role', {'fields': ('role',)}),

        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'fields': ('email', 'password1', 'password2', 'full_name', 'role')
        }),
    )

    ordering = ['-date_joined']

    # lets you filter the list by role directly from the sidebar
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()