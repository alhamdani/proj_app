from django.conf.urls import url
from .lookupViews import *

urlpatterns = [
  url(r'^location/$', lookupLocation, name = 'lookuplocation' ),
  url(r'^product/$', lookupProduct, name = 'lookupproduct' ),
  url(r'^party/$', lookupParty, name = 'lookuparty' ),
]