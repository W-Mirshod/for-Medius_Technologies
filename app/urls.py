from root import settings
from django.urls import path
from app.views import IndexPage
from django.conf.urls.static import static

urlpatterns = [
                  path('', IndexPage.as_view(), name='index'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
