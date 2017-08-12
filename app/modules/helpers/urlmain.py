from django.conf.urls import url, include

urlpatterns = [
    url(r'^lookup/', include('app.modules.helpers.lookupUrl')),
]