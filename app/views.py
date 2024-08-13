import pandas as pd
from io import StringIO
from django.views import View
from app.utils import send_email
from django.contrib import messages
from app.forms import UploadedFilesForm
from django.shortcuts import render, redirect


class IndexPage(View):
    def get(self, request):
        form = UploadedFilesForm()
        return render(request, 'index.html', {'form': form})

    def post(self, request):
        form = UploadedFilesForm(request.POST, request.FILES)
        if form.is_valid():

            email_address = request.POST.get('email')
            files = request.FILES.getlist('file')

            summaries = []

            for uploaded_file in files:
                try:
                    df = self.read_file(uploaded_file)
                    summary = self.generate_summary(df)
                    summaries.append({
                        'file_name': uploaded_file.name,
                        'summary': summary
                    })
                except ValueError as e:
                    return render(request, 'index.html', {'form': form, 'error': str(e)})

            subject = f'Python Assignment - Mirshod (ID: {request.user.id})'
            body = self.format_summaries_as_html(summaries)
            send_email(subject, body, [email_address])

            form.save()

            messages.success(request, "Done! The summary of ur files has been sent to your email.")
            return redirect('index')
        return render(request, 'index.html', {'form': form})

    def read_file(self, file):
        if file.name.endswith('.csv'):
            return pd.read_csv(file)
        elif file.name.endswith('.xlsx'):
            return pd.read_excel(file)
        else:
            raise ValueError('Unsupported file format for summarizing')

    def generate_summary(self, df):
        try:
            buffer = StringIO()
            df.info(buf=buffer)
            summary = {
                'head': df.head().to_html(),
                'description': df.describe().to_html(),
                'info': buffer.getvalue()
            }
            return summary
        except Exception as e:
            print(f"Error generating summary: {e}")
            raise

    def format_summaries_as_html(self, summaries):
        html_content = "<h1>File Summaries</h1>"
        for summary in summaries:
            html_content += f"""
            <h2>File: {summary['file_name']}</h2>
            <h3>Preview</h3>
            {summary['summary']['head']}
            <h3>Description</h3>
            {summary['summary']['description']}
            <h3>Data Info</h3>
            <pre>{summary['summary']['info']}</pre>
            """
        return html_content
