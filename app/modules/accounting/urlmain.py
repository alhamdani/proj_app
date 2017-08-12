from django.conf.urls import url, include

urlpatterns = [
    url(r'^accounting/', include('app.modules.accounting.axilUrl')),
    url(r'^accounting/', include('app.modules.accounting.nethanUrl')),
    url(r'^accounting/', include('app.modules.accounting.absUrl')),
    url(r'^accounting/', include('app.modules.accounting.ianUrl')),
]