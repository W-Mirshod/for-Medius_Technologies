from django.forms import ModelForm

from app.models import UploadedFiles


class UploadedFilesForm(ModelForm):
    class Meta:
        model = UploadedFiles
        exclude = ['file', 'email']
