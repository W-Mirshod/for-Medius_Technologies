from django.contrib import admin

from app.models import UploadedFiles


@admin.register(UploadedFiles)
class UploadedFilesAdmin(admin.ModelAdmin):
    list_display = ('id', 'file', 'email', 'created_at', 'updated_at')
    list_filter = ('id', 'email', 'created_at', 'updated_at')
    search_fields = ('email',)
