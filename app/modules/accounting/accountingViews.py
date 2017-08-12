from django.shortcuts import render
from app.modules.accounting.accountingModels import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q
from app.modules.helpers.gridlist import *
from app.helper import *
from app.modules.party.partyModels import *

def getAllAcctgPeriod(request):
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
  qs = [{'id':ap.id,'code':ap.code,'description':ap.description,'period_type__description':ap.period_type.description,'from_date':str(ap.from_date),'thru_date':str(ap.thru_date) } for ap in AccountingPeriod.objects.all().order_by(*_orders)[frm:to]]
  total = len(qs)
  return JsonResponse( { 'message' : 'success', 'qs' : qs, 'count' : total }, safe = False )

def saveAcctgPeriod(request):
  obj = getJSONObj(request)
  new_entry = obj['data']
  try:
    acctgperiod = AccountingPeriod.objects.get(id=new_entry['updateId'])
  except:
    acctgperiod = AccountingPeriod()
  acctgperiod.code = new_entry['code']
  acctgperiod.description = new_entry['description']
  acctgperiod.period_type_id = new_entry['period_type']
  acctgperiod.from_date = new_entry['from_date']
  acctgperiod.thru_date = new_entry['thru_date']
  acctgperiod.save()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def deleteAcctgPeriod(request):
  obj = getJSONObj(request)
  print (obj,'OBJ')
  acctgperiod = AccountingPeriod.objects.filter(id__in=obj['ids'])
  acctgperiod.delete()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def getAcctgPeriod(request):
  print ('1',request)
  objId = request.GET['id']
  ls = AccountingPeriod.objects.get(id=objId)
  print ('2')
  options = [{'value': p.id, 'label': p.description } for p in PeriodType.objects.all()]
  data = {
    'objid' : ls.id,
    'code' : ls.code,
    'description' : ls.description,
    'period_type' : { 'default_value':ls.period_type.id, 'label':ls.period_type.description, 'options':options },
    'from_date' : str(ls.from_date),
    'thru_date' : str(ls.thru_date)
  }
  print (data,'Yeah!')
  return JsonResponse( { 'message' : 'success', 'qs' : data } )

def searchAcctgPeriod(request):
  obj = getJSONObj(request)
  ls = []
  values = ['id','code','description','period_type__description','from_date','thru_date']
  modelObj = AccountingPeriod.objects.all()
  ls = tablequery(obj, modelObj, values)
  return JsonResponse( { 'message' : 'success', 'qs' : ls } )

def lookupPeriodType(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, PeriodType.objects.all(), ['description'])]
  option = {'name': 'period_type','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

#------General Ledger Account

def getAllGLAccount(request):
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
  ls = GLAccount.objects.all()
  qs = list(ls.order_by('code').values('id','code','description','details','account_type__description')[frm:to])
  #print (qs)
  total = ls.count()
  return JsonResponse( { 'message' : 'success', 'qs' : qs, 'count' : total }, safe = False )

def saveGLAccount(request):
  obj = getJSONObj(request)
  new_entry = obj['data']
  print (new_entry)
  try:
    glacct = GLAccount.objects.get(id=new_entry['updateId'])
  except:
    glacct = GLAccount()
  glacct.code = new_entry['code']
  glacct.description = new_entry['description']
  glacct.details = new_entry['details']
  glacct.account_type_id = new_entry['account_type']
  glacct.save()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def deleteGLAccount(request):
  obj = getJSONObj(request)
  print (obj,'OBJ')
  glacct = GLAccount.objects.filter(id__in=obj['ids'])
  glacct.delete()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def getGLAccount(request):
  objId = request.GET['id']
  ls = GLAccount.objects.get(id=objId)
  options = [{'value': p.id, 'label': p.description } for p in GLAccountType.objects.all()]
  data = {
    'objid' : ls.id,
    'code' : ls.code,
    'description' : ls.description,
    'details' : ls.details,
    'account_type' : { 'default_value':ls.account_type.id, 'label':ls.account_type.description, 'options':options }
  }
  return JsonResponse( { 'message' : 'success', 'qs' : data } )

def searchGLAccount(request):
  obj = getJSONObj(request)
  ls = []
  values = ['id','code','description','details','account_type__description']
  modelObj = GLAccount.objects.all()
  ls = tablequery(obj, modelObj, values)
  return JsonResponse( { 'message' : 'success', 'qs' : ls } )

def lookupGLAccountType(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, GLAccountType.objects.all(), ['description'])]
  option = {'name': 'account_type','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

#-----Organizational Chart of Accounts

def getAllOrgGLAccount(request):
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
  qs = [{'id':ap.id,'party__description':ap.party.description,'gl_account__description':ap.gl_account.description,'accounting_period__code':ap.accounting_period.code,'from_date':str(ap.from_date),'thru_date':str(ap.thru_date) } for ap in OrganizationalGLAccount.objects.all().order_by(*_orders)[frm:to]]
  total = len(qs)
  return JsonResponse( { 'message' : 'success', 'qs' : qs, 'count' : total }, safe = False )


def checkAndConstructDict(_dict):
  _obj = {}
  for x in _dict:
    if x != 'updateId':
      if _dict[x] != 0 and _dict[x] != '':
        _obj[x] = _dict[x]
    else:
      _obj['id'] = _dict[x]
  return _obj

def saveOrgGLAccount(request):
  obj = getJSONObj(request)
  new_entry = obj['data']
  _dict = checkAndConstructDict( new_entry )
  print(new_entry)
  # orgglacct = {}
  # try:
  #   orgglacct = OrganizationalGLAccount.objects.get(id=new_entry['updateId'])
  # except:
  #   orgglacct = OrganizationalGLAccount()
  # print (_dict.items())
  # for key, value in _dict.items():
  #   setattr(orgglacct, key, value)
  # # orgglacct.save()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def deleteOrgGLAccount(request):
  obj = getJSONObj(request)
  print (obj,'OBJ')
  orgglacct = OrganizationalGLAccount.objects.filter(id__in=obj['ids'])
  orgglacct.delete()
  return JsonResponse( { 'message' : 'success' }, safe = False )

def getOrgGLAccount(request):
  objId = request.GET['id']
  ls = OrganizationalGLAccount.objects.get(id=objId)
  options = [{'value': p.id, 'label': p.description } for p in Party.objects.all()]
  options1 = [{'value': p.id, 'label': p.description } for p in GLAccount.objects.all()]
  options2 = [{'value': p.id, 'label': p.code } for p in AccountingPeriod.objects.all()]
  data = {
    'objid' : ls.id,
    'party' : { 'default_value':ls.party.id, 'label':ls.party.description, 'options':options },
    'gl_account' : { 'default_value':ls.gl_account.id, 'label':ls.gl_account.description, 'options':options1 },
    'accounting_period' : { 'default_value':ls.accounting_period.id, 'label':ls.accounting_period.code, 'options':options2 },
    'from_date': str(ls.from_date),
    'thru_date': str(ls.thru_date)
  }
  return JsonResponse( { 'message' : 'success', 'qs' : data } )

def searchOrgGLAccount(request):
  obj = getJSONObj(request)
  ls = []
  values = ['id','party__description','gl_account__description','accounting_period__code','from_date','thru_date']
  modelObj = OrganizationalGLAccount.objects.all()
  ls = tablequery(obj, modelObj, values)
  return JsonResponse( { 'message' : 'success', 'qs' : ls } )

def lookupParty(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, Party.objects.all(), ['description'])]
  option = {'name': 'party','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def lookupGLAccount(request):
  ls = [{'value': p.id, 'label': p.description } for p in keytolist(request, GLAccount.objects.all(), ['description'])]
  option = {'name': 'gl_account','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )

def lookupAccountingPeriod(request):
  ls = [{'value': p.id, 'label': p.code } for p in keytolist(request, AccountingPeriod.objects.all(), ['code'])]
  option = {'name': 'accounting_period','options' : ls }
  return JsonResponse( { 'message' : 'success', 'qs' : option } )
