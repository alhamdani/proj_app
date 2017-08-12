from django.shortcuts import render
from app.models import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q
import json
import sys

from .helper import *

from .views_models_helper import *


def homePage(request): # landing page
  context = {}
  template = 'base.html'

  return render( request, template, context )



def getAllOrg(request):
  data = list( Organization.objects.all().values() )
  return JsonResponse(  data, safe = False )

def addOrg(request):
  dict_obj = getJSONObj(request)
  try:
    new_org = Organization( description = dict_obj['description'], party_id = dict_obj['party_id'] )
    new_org.save()
    return JsonResponse( { 'message' : 'success', 'new_id' : new_org.id }, safe = False )
  except:
    print(sys.exc_info())
    return JsonResponse( { 'message' : 'failed' }, safe = False )

def updateOrg(request):
  dict_obj = getJSONObj(request)
  try:
    qs = Organization.objects.get(id = dict_obj['id'])
    qs.description = dict_obj['new_description']
    qs.save()
    return JsonResponse( { 'message' : 'success' }, safe = False )
  except:
    return JsonResponse( { 'message' : 'failed' }, safe = False )

def deleteOrg(request,org_id):
  try:
    qs = Organization.objects.get(id = org_id)
    qs.delete()
    return JsonResponse( { 'message' : 'success' }, safe = False )
  except:
    print(sys.exc_info())
    return JsonResponse( { 'message' : 'failed' }, safe = False )
  





# below is for userAccess part

def getUserAccess(request):
  # print('query the access of the user')
  emp_id = 0
  try:
    emp_id = int(request.GET['emp_id'])
  except:
    print( sys.exc_info() )
  qs = list( AllUserAccess.objects.filter(person_id = emp_id).select_related('access').order_by('access__order') )
  data = []
  for key in qs:
    temp_obj = { }
    temp_obj[ 'id' ] = key.access_id
    temp_obj['name'] = key.access.name
    temp_obj['parent'] = key.access.parent_id
    temp_obj['url'] = key.access.url
    temp_obj['order'] = key.access.order
    temp_obj['parentHeaderId'] = key.access.header.id
    temp_obj['parentHeaderUrl'] = key.access.header.url
    temp_obj['parentHeaderName'] = key.access.header.name
    temp_obj['parentHeaderOrder'] = key.access.header.order
    temp_obj['access_code'] = key.access_code
    data.append(temp_obj)
    
  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False)

def getAllHeadersAccess( request ):
  data = list(PageHeaderAccess.objects.all().values())
  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False)
  
def getAllNavAccess( request ):
  data = list(PageNavAccess.objects.all().values())
  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False)

def getAllAccessLevel(request):
  qs = PageNavAccess.objects.all().select_related('header')
  data = []
  for key in qs:
    temp_obj = {}
    temp_obj['id'] = key.id
    temp_obj['name'] = key.name
    temp_obj['parent'] = key.parent_id
    temp_obj['url'] = key.url
    temp_obj['order'] = key.order
    temp_obj['parentHeaderId'] = key.header.id
    temp_obj['parentHeaderUrl'] = key.header.url
    temp_obj['parentHeaderName'] = key.header.name
    temp_obj['parentHeaderOrder'] = key.header.order
    data.append(temp_obj)

  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False )

def getAllEmployee( request ):
  obj = getJSONObj(request)
  data = []
  try:
    search = obj['search']
    columns = obj['columns']
    q_obj = Q()
    for item in columns:
      obj = {}
      strCol = item+'__'+'icontains'
      obj[strCol] = search
      q_obj.add(Q(**obj), Q.OR)
    
    ids = PartyRoletype.objects.filter(roletype_master = 1).values_list('party_id')
    # print(Person.objects.filter( party_id__in = list(ids) ).filter( q_obj ).query)
    data = list(Person.objects.filter( party_id__in = list(ids) ).filter( q_obj ).values())
    # print(qs)
    # qs = Person.objects.filter( q_obj )
    # print(qs.query)
  except: 
    print(sys.exc_info())
  return JsonResponse( { 'message' : 'success', 'qs' : data }, safe = False )



def updateEmpAccess( request ):
  obj = getJSONObj(request)
  emp = obj[ 'emp' ]
  accessess = obj[ 'access' ]
  qs = AllUserAccess.objects.filter( person_id = emp['id'] ).delete()
  for access in accessess:
    _access_code = ''
    try:
      _access_code = access['trans']
    except:
      _access_code = ''
      
    _qs = AllUserAccess( \
        person_id = emp['id'], \
          access_id = access['access_id'], \
            access_code = _access_code )
    _qs.save()
  # emp_id = obj['emp']
  # qs = AllUserAccess.objects.filter()
  # for x in obj['ids']:
  #   try:
  #     print(x['id'], x['access_code'], emp_id)
  #   except:
  #     pass
  return JsonResponse( { 'message' : 'success' }, safe = False )


def getEmployeeOnRange(request):
  obj = getJSONObj(request)
  searchFor = ''
  columns = []
  _from = 0
  _to = 0
  _order = '?'
  try:
    searchFor = obj['searchKey']
  except:
    pass

  try:
    columns = obj['columns']
    columns.append('id')
  except:
    pass
  try:
    _from = obj['_from']
    _to = obj['_to']
  except:
    pass

  q_obj = Q()
  for item in columns:
    obj = {}
    strCol = item+'__'+'icontains'
    obj[strCol] = searchFor
    q_obj.add(Q(**obj), Q.OR)

  ids = PartyRoletype.objects.filter(roletype_master = 1).values_list('id') # get all employees on roletype
  # data = list(Person.objects.filter( party_id__in = list(ids) ).filter( q_obj )[_from:_to].values())
  
  d1 = []
  # q1 = PartyRoletype.objects.filter(roletype_master = 1).values_list('id')
  q2 = Person.objects.filter( party_id__in = list(ids) ).filter( q_obj )[_from:_to]
  for x in q2:
    d1.append(
      {
        'first_name' : x.first_name,
        'id' : x.id,
        'last_name' : x.last_name,
        'marital_status' : x.marital_status,
        'middle_name' : x.middle_name,
        'party_id' : x.party_id,
        'suffix' : x.suffix,
        'roletype_master_id' : 1
      }
    )
  return JsonResponse({ 'message' : 'success', 'qs' : d1 }, safe = False)




def searchEmployee(request): # unused fn
  obj = getJSONObj(request)

  return JsonResponse({'message' : 'success'})

def countSearchEmployee(request):
  obj = getJSONObj(request)
  
  searchFor = ''
  columns = []
  try:
    columns = obj['columns']
  except: 
    pass
  try:
    searchFor = obj['searchKey']
  except:
    pass
  q_obj = Q()
  for item in columns:
    obj = {}
    strCol = item+'__'+'icontains'
    obj[strCol] = searchFor
    q_obj.add(Q(**obj), Q.OR)
  
  ids = PartyRoletype.objects.filter(roletype_master = 1).values_list('id') # get all employees on roletype
  counted = Person.objects.filter( party_id__in = list(ids) ).filter( q_obj ).count()
  # print(Person.objects.filter( party_id__in = list(ids) ).filter( q_obj ).query, data)
  return JsonResponse({'message' : 'success', 'counted' : counted})

def getEmployeeCount(request):
  ids = PartyRoletype.objects.filter(roletype_master = 1).values_list('id') # get all employees on roletype
  data = Person.objects.filter( party_id__in = list(ids) ).count()

  return JsonResponse({'message' : 'success', 'counted' : data },safe = False)

def getAllStatus(request):

  return JsonResponse({'message' : 'success', 'qs' : [] })
def testUrl(request):
  data = [
    { 'id' : 1, 'value' : 'one' },
    { 'id' : 2, 'value' : 'Two' },
    { 'id' : 3, 'value' : 'Third' },
    { 'id' : 4, 'value' : 'Fourth' },
    { 'id' : 5, 'value' : 'Fifth' },
    { 'id' : 6, 'value' : 'Sixth' },
  ]
  return JsonResponse({'message': 'success', 'qs' : data })


# +++++++++++++++++++++++++++++++++++ below will be the final views ++++++++++++++++++++++++++++

def getGroupAccessTreeStruc():
  _aoag = AccessOnAccessGroup.objects.all().select_related('group_access', 'access')
  # for x in _aoag:
  #   print(x.group_access, ' - > ',x.access)
  # print(_aoag)
  _s1 = set()
  _s2 = {} # all access code on each group

  for x in _aoag: # group group_access and access
    # print(x.access_id, x.group_access_id)
    if x.group_access_id not in _s1:
      _s1.add( x.group_access_id )
      _s2[ x.group_access_id ] = {
        'id':x.group_access_id,
        'description' : x.group_access.description,
        'access_list' : []
      }
    else:
      _s2[ x.group_access_id ]['access_list'].append({
        'access_id' : x.access.id,
        'access_code' : x.access.code,
        'access_description' : x.access.description
      })
  return _s2

def allGroupAccess(): # copied on mainViews.py
  on_list = list(GroupAccess.objects.all().values())
  on_dict = {}
  for x in on_list:
    on_dict[x['id']] = x
  return { 'on_list' : on_list, 'on_dict' : on_dict }

def allAccess():
  on_list = list(Access.objects.all().values())
  on_dict = {}
  for x in on_list:
    on_dict[ x['id'] ] = x
  return { 'on_list' : on_list, 'on_dict' : on_dict }

def accessOnAccessGroup():
  on_list = list(AccessOnAccessGroup.objects.all().values())
  on_dict = {}
  for x in on_list:
    on_dict[x['id']] = x
  return { 'on_list' : on_list, 'on_dict' : on_dict }








def deleteSelectedPerson(request):
  obj = getJSONObj(request)
  ids = obj[ 'ids' ]

  

  return JsonResponse( { 'message' : 'success' } )
  
def saveNewPerson(request):
  obj = getJSONObj( request )

  print(obj)
  
  return JsonResponse( { 'message' : 'success' } )

def getPersonOnRange( lmt, pg ):
  _t = pg * lmt;
  _f = _t - lmt;
  party_ids = list(Party.objects.all().values_list('id')[ _f : _t ])
  return ( list(Person.objects.filter(party_id__in = party_ids).values()) )

def getAllPersonOnRange(request):
  obj = getJSONObj(request)
  lmt = 20
  pg = 0
  persons = []
  try:
    lmt = int( obj['limit'] )
    pg = int( obj['page'] )
    persons = getPersonOnRange( lmt, pg )
  except:
    print(sys.exc_info())
    pass
  
  return JsonResponse( { 'message' : 'success', 'qs' : persons } )





def ga(  ):
  _gam = GroupAppModules.objects.all().select_related('group', 'app_module', 'group_access' )

    # print(app_module_tree[x['app_module_id']])


def customGroupAppModAxs(party_id):
  return list(PartyGroupOnCustom.objects.filter(party_id = party_id).values_list('app_module', flat = True))
  
def allPartyGroupOnCustom(party_id):
  _qs = PartyGroupOnCustom.objects.filter()
  return []


def getLoggedInUserAccess(request):
  # logged_in_id = 58
  logged_in_party_id = 59
  app_module_defn = {}
  mods_on_custom = customGroupAppModAxs(logged_in_party_id)
  modules_tree = getAppModulesStruc( app_module_defn )
  pg_ids = []
  login_module_id_acess = []
  if len(mods_on_custom) == 0:
    pg_ids = list(PartyGroup.objects.filter(party_id = logged_in_party_id).values_list('group_id', flat=True))
    app_module_defn = allGroupAppModule(pg_ids)['by_am'] # get all group app module using its id or app_module_id as the key
    login_module_id_acess = list( GroupAppModules.objects.filter(group_id__in = pg_ids).values_list('app_module', flat = True))
  else:
    app_module_defn = allGroupAppModuleOnCustom( logged_in_party_id )
    login_module_id_acess = mods_on_custom
 
  return JsonResponse( {
    'message' : 'success', 
    'qs' : {}, 
    'modules' : [], 
    'module_tree' : modules_tree, 
    'login_module_id_acess' : login_module_id_acess,
  } )



# def getCustomMod



# deprecate
def buildGroupAccessTree(): 
  _aoag = accessOnAccessGroup()
  _aoag_li = _aoag['on_list']

  _ga = allGroupAccess()
  _ga_dict = _ga['on_dict']

  _a = allAccess()
  _a_dict = _a['on_dict']

  _temp_obj = {}
  _qSet = set()
  for x in _aoag_li:
    if x['group_access_id'] not in _qSet:
      _qSet.add( x['group_access_id'] )
      _ga_defn = _ga_dict[  x['group_access_id'] ]
      _temp_obj[ x['group_access_id'] ] = {
        'group_access_id' : _ga_defn['id'],
        'group_access_desc' : _ga_defn['description']
      }
      _temp_obj[ x['group_access_id'] ]['access_list'] = []
    _a_defn = _a_dict[ x['access_id'] ]
    _temp_obj[ x['group_access_id'] ][ 'access_list' ].append(
      { 
        'access_id' : _a_defn['id'],
        'access_code' : _a_defn['code'],
        'access_desc' : _a_defn['description']
      }
    )
  return { 'the_tree' : _temp_obj, 'access_list' : _a['on_list'], 'group_access_list' : _ga['on_list'] }

# def filterOutModules():

# deprecate
def groupAppModules():
  return list(GroupAppModules.objects.all().values())

# deprecate
def buildGroupAppModuleTree( group_list, app_module_tree, group_access_tree ):
  # print( type( group_list ), type( app_module_tree ), type( group_access_tree ))
  _gam = groupAppModules()
  _temp_obj = {}
  _set = set()
  for x in _gam:
    if x['group_id'] not in _set:
      _set.add( x['group_id'] )
      _temp_obj [ x['group_id'] ] = {
        'group_info' : group_list[ x['group_id'] ],
        'group_access_modules' : []
      }
    _temp_obj [ x['group_id'] ][ 'group_access_modules' ].append({
      'group_access' : group_access_tree[ x['group_access_id'] ],
      'app_module' : app_module_tree[ x['app_module_id'] ]
    })
  _grp = list(Group.objects.all().values())
  
  _obj = {}

  for x in _grp:
    x['group_access_modules'] = []
    _obj[ x['id'] ] = x
  return _temp_obj


def getAllPersonAccessLevel(request):
  _arr = []
  _w = set()

  __w = set()
  _obj = {}

  qs = PartyGroup.objects.all().select_related('party', 'group')
  for x in qs:
    try:
      person = {}
      
      if x.party.id not in __w: # if not yet on the storage ( _obj ) then query it
        __w.add( x.party.id )
        person = Person.objects.get( party_id = x.party.id)
        _obj[x.party.id] = person
      else: # if queried before then get the stored data
        person = _obj[x.party.id]

      group = Group.objects.get( id = x.group.id )
      if person.id not in _w:
        _w.add( person.id )
        _arr.append({ 
          'id' : x.party.id, 
          'person_id' : person.id,
          'full_name' : person.first_name + ' ' + person.last_name,
          'group' : group.description
        })
      else:
        for y in _arr:
          if y['id'] == x.party.id:
            y['group'] += ', ' + group.description
            break

    except:
      print(sys.exc_info())
      pass
  
  return JsonResponse( {'message' : 'success', 'qs' : _arr } )




def getallgender(r):
  return JsonResponse( { 
    'message' : 'success', 
    'qs' : { 
      'name' : 'gender', 
      'options' : [ 
        { 'label' : 'Male', 'value' : 2 }, 
        { 'label' : 'Female', 'value' : 1 }, 
        { 'label' : 'Bi-sexual', 'value' : 3}] } } )

def getallsome(r):
  return JsonResponse( { 
    'message' : 'success', 
    'qs' : 
      { 'name' : 'some', 'options' : [
        { 'label' : 'Some one', 'value' : 123 },
        { 'label' : 'Some two', 'value' : 1234 },
        { 'label' : 'Some three', 'value' : 1235 },
        { 'label' : 'Some three', 'value' : 12356 },
        { 'label' : 'Some three', 'value' : 12312 },
      ] } } )
def getallanother(r):
  return JsonResponse( { 
    'message' : 'success', 
    'qs' : { 
      'name' : 'another', 
      'options' : [
        { 'label' : 'Another one', 'value' : 54534 },
        { 'label' : 'Another two', 'value' : 5125 },
      ] } } )

def getalllookup(r):
  keyWord = r.GET['key']

  return JsonResponse( 
    { 'message' : 'success',
    'qs' : {
      'options' : [
        { 'label' : 'Option one', 'value' : '4' },
        { 'label' : 'Option Two', 'value' : '5' },
        { 'label' : 'Option Three', 'value' : '6' },
        { 'label' : 'Option Four', 'value' : '7' },
      ]
    } } )

# def isHaveCustomPageAccess(party_id): # copied in mainViews.py
#   counter = PartyGroupOnCustom.objects.filter(party_id = party_id).count()
#   if counter > 0:
#     return True
#   return False

# def allGroup(): # copied on mainViews.py
#   on_list = list(Group.objects.all().values())
#   on_dict = {}
#   for x in on_list:
#     on_dict[x['id']] = x
  
#   return { 'on_list' : on_list, 'on_dict' : on_dict }



# def groupModuleAndAxs( group_id ):
#   _qs = GroupAppModules.objects.filter(group_id = group_id).select_related('group', 'app_module', 'group_access')
#   _am_as_key = {} # app module (am) as key
#   _id_as_key = {} # id (GroupAppModule) as key
#   for x in _qs:
#     data = {
#       'group_app_module_id' : x.id,
#       'group' : { 'id' : x.group.id, 'description' : x.group.description },
#       'group_access' : { 'id' : x.group_access.id, 'description' :x.group_access.description },
#       'app_module_id' : x.app_module.id
#     }
#     _am_as_key[ x.app_module.id ] = data
#     _id_as_key[ x.id ] = data

#   return {'by_am':_am_as_key, 'by_id' : _id_as_key }

# def getGroupModulesAndAxs(request): # copied on mainViews.py
#   group_id = request.GET['group_id']
#   grp_mod_axs = groupModuleAndAxs( group_id )[ 'by_am' ]

#   mod_tree = getAppModulesStruc( grp_mod_axs )
#   return JsonResponse({'message' : 'success', 'mod_tree' : mod_tree})







# def groupAppModuleIdByGroup(all_group_app_module):
#   _set = set()
#   obj = {}
#   # print(all_group_app_module)
#   for x in all_group_app_module:
#     item = all_group_app_module[x]
#     group_id = item['group']['id']
#     if group_id not in _set:
#       _set.add(group_id)
#       obj[group_id] = []
#     obj[group_id].append( item['app_module_id'] )
 
#   return obj




# def getAccess(person_id):
#   pgs = PartyGroup.objects.filter(party_id = person_id) # get the group where the user belong
#   groups = list(pgs.values())
#   pg_ids = list(pgs.values_list('group_id', flat=True))
#   gam = GroupAppModules.objects.filter(group_id__in = pg_ids).select_related('group','app_module','group_access') # get the group app modules of the group
#   _ggats = getGroupAccessTreeStruc()
#   _gamts = getAppModulesStruc()
#   # for x in _gamts:
#   #   print( x )
#   _a = set()
#   _b = set()
#   _c = set()
#   _access = {}
#   _mods = []
#   _unconstructed_mods = {}
#   for x in gam:
#     # print('- - - - - - - - >',x.group.description)
#     if x.group_id not in _c:
#       _c.add( x.group_id )
#       _access[ x.group_id ] = {
#         'access' : _ggats[ x.group_access_id ],
#         'group_description' : x.group.description,
#         'group_id' : x.group.id,
#         'modules' : []
#       }
#     _access[ x.group_id ]['modules'].append( _gamts[ x.app_module_id ] )
    
#     if x.app_module_id not in _a:
#       _a.add( x.app_module_id )
#       _mods.append( _gamts[ x.app_module_id ] )

  
#   return { 
#     'access' : _access, 
#     'modules' : _mods, 
#     'group_access_tree' : _ggats, 
#     'modules_tree' : _gamts 
#   }





# def getLoggedInUserAccess(request):
#   # logged_in_id = 58
#   logged_in_id = 59
#   # pg_ids = list(PartyGroup.objects.filter(party_id = logged_in_id).values_list('group_id')) # get the group where the user belong
  
#   pgs = PartyGroup.objects.filter(party_id = logged_in_id) # get the group where the user belong
#   pg_ids = list(pgs.values_list('group_id', flat=True))


#   # print(pg_ids)
#   gam = GroupAppModules.objects.filter(group_id__in = pg_ids).select_related('group','app_module','group_access') # get the group app modules of the group
#   _ggats = getGroupAccessTreeStruc()
#   _gamts = getAppModulesStruc()

#   _a = set()
#   _b = set()
#   _c = set()
#   _access = {}
#   _mods = []
#   for x in gam:
#     if x.group_id not in _c:
#       _c.add( x.group_id )
#       _access[ x.group_id ] = {
#         'access' : _ggats[ x.group_access_id ],
#         'modules' : []
#       }
#     _access[ x.group_id ]['modules'].append( _gamts[ x.app_module_id ] )
    
#     if x.app_module_id not in _a:
#       _a.add( x.app_module_id )
#       _mods.append( _gamts[ x.app_module_id ] )
  
#   return JsonResponse({'message' : 'success', 'qs' : _access, 'modules' : _mods } )