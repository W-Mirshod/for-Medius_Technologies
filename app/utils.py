from django.core.mail import EmailMessage

from root.settings import env


def send_email(subject, body, recipient_list):
    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=env('EMAIL_HOST_USER'),
        to=recipient_list
    )
    email.content_subtype = 'html'
    email.send()
