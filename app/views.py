from django.shortcuts import render, redirect
from django.views import View
from app.forms import UploadedFilesForm


class IndexPage(View):
    def get(self, request):
        form = UploadedFilesForm()
        return render(request, 'index.html', {'form': form})

    def post(self, request):
        form = UploadedFilesForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('index')
        return render(request, 'index.html', {'form': form})
