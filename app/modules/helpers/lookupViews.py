from app.modules.product.productModels import *
from app.modules.location.locationModels import *
from app.modules.document.documentModels import *
from app.modules.main.mainModels import *
from app.modules.helpers.gridlist import *
from django.http import HttpRequest,JsonResponse

def lookupLocation(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Location.objects.all(), ['description'])]
  option = {'name': 'location','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def lookupProduct(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Product.objects.all(), ['description'])]
  option = {'name': 'product','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def lookupParty(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Party.objects.all(), ['description'])]
  option = {'name': 'party','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )