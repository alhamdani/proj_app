from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('app.modules.main.subUrlsV1')),
]