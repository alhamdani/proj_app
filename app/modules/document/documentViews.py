from django.shortcuts import render
from app.modules.document.documentModels import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q
from django.db import  transaction
from app.modules.helpers.gridlist import *
from app.helper import *
from app.modules.product.productModels import *
from app.modules.location.locationModels import *
import random
import string
import sys


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
  return ''.join(random.choice(chars) for _ in range(size))


def getAlldocumentHeader(request):
  obj = getJSONObj(request)
  limit = int(obj['limit'])
  page = int(obj['page'])
  to = page * limit;
  frm = to - limit;
  _orders = []
  try:
    _orders = request.GET.getlist('orders[]')
  except: 
    print(sys.exc_info())
  qs = []
  hdr = documentHeader.objects.all()[frm:to]
  for h in hdr:
    val = {}
    val['id'] = h.id
    val['document_no'] = h.document_no
    val['doctype__description'] = h.doctype.description
    val['party__description'] = h.party.description
    val['location__description'] = h.location.description
    val['docdate'] = str(h.docdate)
    qs.append(val)
  total = len(qs)
  return JsonResponse( { 'message' : 'success', 'qs' : qs, 'count' : total }, safe = False )

def savedocumentHeader(request):
  return JsonResponse( { 'message' : 'success' }, safe = False )

def deletedocumentHeader(request):
  obj = getJSONObj(request)
  dtl = documentDetail.objects.filter(docheader_id__in=obj['ids'])
  dtl.delete()
  hdr = documentHeader.objects.filter(id__in=obj['ids'])
  hdr.delete()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def searchdocumentHeader(request):
  obj = getJSONObj(request)
  ls = []
  values = ['id','document_no','doctype__description','party__description','location__description','docdate']
  modelObj = documentDetail.objects.all()
  ls = tablequery(obj, modelObj, values)
  return JsonResponse( { 'message' : 'success', 'qs' : ls } )

def lookupdocumentType(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, documentType.objects.all(), ['description'])]
  option = {'name': 'doctype','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def sample_q1(request):
  data = { 
    'name' : 'branch',
    'options' : [ 
      { 'label' : 'Branch one', 'value' : '11vs' }, 
      { 'label' : 'Second Branch', 'value' : '323x' },
      { 'label' : '3rd branch', 'value' : '21192' }
    ] 
  }
  return JsonResponse({'message' : 'success', 'qs' : data})

def sample_q2(request):
  print( request.GET['keyCode'] )
  data = { 
    'name' : 'warehouse',
    'options' : [
      { 'label' : 'AmS', 'value' : '321' },
      { 'label' : 'HQ', 'value' : '44' }, 
      { 'label' : 'Doc', 'value' : 'iek3' }
    ]
  }
  return JsonResponse({'message' : 'success', 'qs' : data})

def sample_q3(request):
  return JsonResponse({'message' : 'success'})

def sample_q4(request):
  return JsonResponse({'message' : 'success'})

def sample_q5(request):
  return JsonResponse({'message' : 'success'})

def sample_q6(request):
  return JsonResponse({'message' : 'success'})



def tab1url(request):
  #print (request.GET,'+++++++++++')
  data = []
  if 'headerId' in request.GET:
    header_id = request.GET['headerId']
    ls = documentDetail.objects.filter(docheader_id=header_id)
    for l in ls:
      data.append({
        'id' : l.id,
        'product' : { 'default_value': l.product.id, 'label': l.product.description },
        'quantity' : l.quantity,
        'unit_price' : l.unit_price,
        'delivery_date' : str(l.delivery_date),
        'comments' : l.comments,
        'branch' : { 'default_value' : '11vs' }
      })
  return JsonResponse({'message' : 'success', 'qs' : data })

def savenewdatatab1url(request):
  obj = getJSONObj(request)
  new_data = obj[ 'new_data' ]
  id = id_generator()
  new_data['id'] = id
  
  # print(obj[ 'new_data' ]) # array/list type
  return JsonResponse( { 'message' : 'success', 'qs' : new_data } )

def deletedatatab1url(request):
  obj = getJSONObj(request)
  print(obj['delete_ids'])

  return JsonResponse({'message' : 'success'})

def doctypeselect(request):
  opts = [
    { 'label' : 'Doctype one', 'value' : 23 },
    { 'label' : 'Docs Docs', 'value' : 8273 },
    { 'label' : '3rd Type', 'value' : 7263 },
  ]
  return JsonResponse({'message' : 'success', 'qs' : { 'options' : opts, 'name' : 'doctype' } } )
def doctypeselect2(request):
  opts = [
    { 'label' : 'Doctype one', 'value' : 23 },
    { 'label' : 'Docs Docs', 'value' : 8273 },
    { 'label' : '3rd Type', 'value' : 7263 },
  ]
  return JsonResponse({'message' : 'success', 'qs' : { 'options' : opts, 'name' : 'qwe' } } )
def saveheadernewinfo(request):
  obj = getJSONObj(request)
  print(obj['new_data'])  
  return JsonResponse({'message' : 'success'})

def tab2url(request):
  return JsonResponse({'message' : 'success', 'qs' : [] })

def tab3url(request):
  return JsonResponse( { 'message' : 'success', 'qs' : [] } )

def tab4url(request):
  return JsonResponse( { 'message' : 'success', 'qs' : [] } )

def tab5url(request):
  return JsonResponse( { 'message' : 'success', 'qs' : [] } )

def tab6url(request):
  return JsonResponse( { 'message' : 'success', 'qs' : [] } )

def savetab1url( request ):
  obj = getJSONObj(request)
  new_datas = obj['new_datas']
  data = []
  header_id = ''
  if 'headerId' in obj:
    header_id = obj['headerId']
  for x in new_datas:
    if x['id'] == '': # to add
      data.append({
        'id':id_generator(),
        'idx' : x['idx']
      })
    else: # edit code
      pass
    print( x )
  return JsonResponse( { 'message' : 'success', 'qs' : data } )
 


def getHeaderDetail( request ):
  header_id = request.GET['header_id']
  ls = documentHeader.objects.get(id=header_id)
  doctype = [{'value': p.id, 'label': p.description } for p in documentType.objects.all()]
  party = [{'value': p.id, 'label': p.description } for p in Party.objects.all()]
  location = [{'value': p.id, 'label': p.description } for p in Location.objects.all()]
  data = {
    # 'order_type' : { 
    #   'default_value' : '4', 
    #   'options' : [ 
    #     { 'label' : '2nd Type', 'value' : '23'}, 
    #     { 'label' : 'Fourth Type', 'value' : '928' }, 
    #     { 'label' : 'Semi-order', 'value' : '23923'} ]},
    # 'order_number' : 2834,
    # 'order_date' : '2016-07-07',
    # 'request_on' : { 'default_value' : 3, 'label' : 'Unknown' },
    # 'order_type2' : 'Order TYPE TWO',
    # 'date_created' : '2017-04-02',
    'objid' : ls.id,
    'doctype' : { 'default_value':ls.doctype.id, 'label':ls.doctype.description, 'options':doctype },
    'party' : { 'default_value':ls.party.id, 'label':ls.party.description, 'options':party },
    'location' : { 'default_value':ls.location.id, 'label':ls.location.description, 'options':location },
    'docdate': str(ls.docdate),
    'remarks': ls.remarks
  }
  print (data)
  return JsonResponse( { 'message' : 'success', 'qs' : data } )

def lookupLocation(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Location.objects.all(), ['description'])]
  option = {'name': 'location','options' : ls }
  print (option)
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def lookupProduct(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Product.objects.all(), ['description'])]
  option = {'name': 'product','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def requestonlookup( request ):
  key = request.GET['key']
  data = [
    { 'label' : 'Choice one', 'value' : 'c1' },
    { 'label' : 'X choice', 'value' : 'xx' },
    { 'label' : 'Five FOur', 'value' : '54' },
    { 'label' : 'Yep', 'value' : 'yp' },
    { 'label' : 'Tier', 'value' : 'tr' },
  ]
  print(key)

  return JsonResponse( {'message' : 'success', 'qs' : data } )

def saveedited( request ):
  obj = getJSONObj(request)

  print(obj[ 'new_data' ]) # array/list type

  return JsonResponse( {'message' : 'success' } )
  