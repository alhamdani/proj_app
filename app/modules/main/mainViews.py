from django.shortcuts import render
from app.models import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q
import json
import sys

from app.helper import *
from app.views_models_helper import *

def saveNewPersonGroup(request):
  dict_obj = getJSONObj(request)
  try:
    party_id = dict_obj['party_id']
    group_ids = dict_obj['group_ids']
    qs = PartyGroup.objects.filter(party_id=party_id).delete()
    print(qs)
    for x in group_ids:
      qs = PartyGroup(party_id = party_id, group_id = x)
      qs.save()

    return JsonResponse({ 'message' : 'success' })
  except:
    return JsonResponse({ 'message' : 'failed' })

def getGroupOnTyped(request):
  keyWord = request.GET['keyWord']
  data = list(Group.objects.filter( description__icontains = keyWord ).values())
  return JsonResponse({'message' : 'success', 'qs' : data })

def saveNewGroupDefinition(request):
  dict_obj = getJSONObj(request)
  new_defn = dict_obj['new_defn']
  group_id = dict_obj['group_id']

  GroupAppModules.objects.filter(group_id = group_id).delete()

  for x in new_defn:
    gam = GroupAppModules(group_id = x['group_id'], app_module_id = x['app_module_id'], group_access_id = x['group_access_id'])
    gam.save()

  return JsonResponse({'message' : 'success'})

def getAllGroups(request):
  # _qs = list( Group.objects.all().values() )
  # print(_qs)
  _qs = [ {'value': q['id'], 'label': q['description'] } for q in Group.objects.all().values() ]
  data = {
    'name' : 'group',
    'options' : _qs
  }
  return JsonResponse({'message' : 'success', 'qs' : data})

def allGroup():
  on_list = list(Group.objects.all().values())
  on_dict = {}
  for x in on_list:
    on_dict[x['id']] = x
  
  return { 'on_list' : on_list, 'on_dict' : on_dict }

def getAllGroupAndPersonGroup(request):
  
  party_id = request.GET['party_id']
  all_group = allGroup()['on_list']
  person_group_ids = list(PartyGroup.objects.filter(party_id = party_id).values_list('group', flat = True))

  print(person_group_ids)
  return JsonResponse( { 'message' : 'success', 'qs' : { 'all_group' : all_group, 'person_group_ids' : person_group_ids } } )


def getGroupModuleId(request):
  
  return JsonResponse( { 'message' : 'success' } )



def groupAppModuleIdByGroup(all_group_app_module):
  _set = set()
  obj = {}
  # print(all_group_app_module)
  for x in all_group_app_module:
    item = all_group_app_module[x]
    group_id = item['group']['id']
    if group_id not in _set:
      _set.add(group_id)
      obj[group_id] = []
    obj[group_id].append( item['app_module_id'] )
 
  return obj

def allGroupAccess():
  on_list = list(GroupAccess.objects.all().values())
  on_dict = {}
  for x in on_list:
    on_dict[x['id']] = x
  return { 'on_list' : on_list, 'on_dict' : on_dict }

def getAppModulesAxsTree(request):

  all_group_app_module = allGroupAppModule('')
  app_module_defn = all_group_app_module['by_am']

  modules_tree = getAppModulesStruc( {} )
  group_module_ids = groupAppModuleIdByGroup( all_group_app_module['by_id'] )
  all_groups = allGroup()['on_list']
  all_group_access = allGroupAccess()['on_dict']
  return JsonResponse({ 
    'message' : 'success', 
    'mod_tree' : modules_tree, 
    'group_module_ids' : group_module_ids, 
    'all_groups' : all_groups,
    'all_group_access' : all_group_access })

def groupModuleAndAxs( group_id ):
  _qs = GroupAppModules.objects.filter(group_id = group_id).select_related('group', 'app_module', 'group_access')
  _am_as_key = {} # app module (am) as key
  _id_as_key = {} # id (GroupAppModule) as key
  for x in _qs:
    data = {
      'group_app_module_id' : x.id,
      'group' : { 'id' : x.group.id, 'description' : x.group.description },
      'group_access' : { 'id' : x.group_access.id, 'description' :x.group_access.description },
      'app_module_id' : x.app_module.id
    }
    _am_as_key[ x.app_module.id ] = data
    _id_as_key[ x.id ] = data

  return {'by_am':_am_as_key, 'by_id' : _id_as_key }


def getGroupModulesAndAxs(request):
  group_id = request.GET['group_id']
  grp_mod_axs = groupModuleAndAxs( group_id )[ 'by_am' ]

  mod_tree = getAppModulesStruc( grp_mod_axs )
  return JsonResponse({'message' : 'success', 'mod_tree' : mod_tree})


def getPersonInfo(request):
  ID = ''
  usePartyId = True
  data = {}
  qs = {}
  try:
    ID = request.GET['party_id']
    qs = Person.objects.get(party_id = ID)
  except:
   pass
  try: 
    ID = request.GET['person_id']
    qs = Person.objects.get(id = ID)
  except:
    pass
  
  try: # for add edit form
    ID = request.GET['id']
    qs = Person.objects.get(party_id = ID)
  except:
    pass
  
  data = {
    'first_name' : qs.first_name,
    'last_name' : qs.last_name,
    'middle_name' : qs.middle_name,
    'suffix' : qs.suffix,
    'marital_status' : qs.marital_status,
    'group' : { 
      'default_value' : 2, 
      'options' : [ {'value': q['id'], 'label': q['description'] } for q in Group.objects.all().values() ] 
    },
    'group2' : {
      'default_value' : 2,
      'label' : 'Accounting'
    }
   
  }

  return JsonResponse( { 'message' : 'success', 'qs' : data } )

def saveNewPartyLevelAccess(request):
  dict_obj = getJSONObj(request)
  new_axs_defn = dict_obj['new_axs_defn']
  party_id = dict_obj['party_id']
  try:
    qs = PartyGroupOnCustom.objects.filter(party_id = party_id).delete()
  except:
    pass
  
  for x in new_axs_defn:
    pgom = PartyGroupOnCustom(party_id = party_id, app_module_id = x['app_module_id'], group_id = x['group_id'], group_access_id = x['group_access_id'])
    pgom.save()

  return JsonResponse({'message' : 'success'})

def countSearchedRoletype(request):
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

  data = RoletypeMaster.objects.filter( q_obj ).count()

  return JsonResponse({'message' : 'success', 'counted' : data })



def countAllRoletype(request):
  data = RoletypeMaster.objects.all().count()
  return JsonResponse({'message' : 'success', 'counted' : data})


def getRoletypeOnRange(request):
  data = []
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

  data = list(RoletypeMaster.objects.filter( q_obj )[_from:_to].values())
  print(data)
  return JsonResponse({'message' : 'success', 'qs' : data }, safe = False)

def getRoletypeInfo(request):
  id = request.GET['id']
  print('query info roletype')
  obj = {}
  data = RoletypeMaster.objects.filter(id = id)[:1].values()
  obj['value'] = data[0]['id']
  obj['label'] = data[0]['description']
  
  return JsonResponse({ 'message' : 'success', 'qs' : obj })

def getPartyInfo(request):
  id = request.GET['id']
  obj = {}
  data = Party.objects.filter(id = id)[:1].values()
  obj['value'] = data[0]['id']
  obj['label'] = data[0]['description']
  
  return JsonResponse({ 'message' : 'success', 'qs' : obj })

def getAllPartyOnRange(request):
  obj = getJSONObj(request)
  # qs = Party.objects.all()
  searchKey = obj[ 'searchKey' ]
  qs = Party.objects.filter( description__icontains = searchKey )
  data = []
  for x in qs:
    data.append({
      'value' : x.id,
      'label' : x.description
    })
  return JsonResponse({'message' : 'success', 'qs' : data })

def isHaveCustomPageAccess(party_id):
  counter = PartyGroupOnCustom.objects.filter(party_id = party_id).count()
  if counter > 0:
    return True
  return False

def getPersonAccess(request):
  party_id = request.GET['party_id']
  # first check the custom table
  isCustomAccess = isHaveCustomPageAccess( party_id )
  all_group_app_module = {}
  
  pg = PartyGroup.objects.filter(party_id = party_id).select_related('group')
  pg_ids = []
  for x in pg:
    pg_ids.append(x.group.id)
  print(pg_ids)
  if isCustomAccess :
    all_group_app_module = allGroupAppModuleOnCustom( party_id )
  else:
    all_group_app_module = allGroupAppModule( pg_ids )

  # using app_module_id as the key
  
  # all_group_app_module = allGroupAppModule()

  # get all the app module ids of the group
  group_module_ids = groupAppModuleIdByGroup( all_group_app_module['by_id'] ) 

  app_module_defn = all_group_app_module['by_am']
  modules_tree = getAppModulesStruc( app_module_defn )

  all_group_access = allGroupAccess() # use if user change access on specific module
 
  pg = PartyGroup.objects.filter(party_id = party_id).select_related('group')
  
    
  # pg_ids = []
  # # person_groups = []
  # for x in pg:
  #   pg_ids.append(x.group.id)
    # person_groups.append({
    #   'id' : x.group.id,
    #   'description' : x.group.description
    # })
  person_group_app_mods = []
  if isCustomAccess :
    person_group_app_mods = list(PartyGroupOnCustom.objects.filter(party_id = party_id).values_list('app_module', flat = True))
  else:
    person_group_app_mods = list( GroupAppModules.objects.filter(group_id__in = pg_ids).values_list('app_module', flat = True))
  
  # person_group_app_modules = list( GroupAppModules.objects.filter(group_id__in = pg_ids).values_list('app_module', flat = True))
  all_groups = allGroup()['on_list']
  return JsonResponse( {
    'message' : 'success',
    'modules_tree' : modules_tree,
    'person_app_module_ids' : person_group_app_mods,
    'all_group_access' : all_group_access['on_dict'],
    # 'person_groups' : person_groups,
    'all_groups' : all_groups,
    'person_group_ids' : pg_ids,
    'group_module_ids' : group_module_ids
  } )


def searchPersonOnRange( request ):
  obj = getJSONObj(request)
  lmt = int( obj['limit'] )
  pg = int( obj['page'] )
  searchKey = obj[ 'searchKey' ]
  columns = obj[ 'columns' ]
  persons = []
  _t = pg * lmt;
  _f = _t - lmt;
  q_obj = Q()
  for item in columns:
    obj = {}
    strCol = item+'__'+'icontains'
    obj[strCol] = searchKey
    q_obj.add(Q(**obj), Q.OR)
  # party_ids = list(Party.objects.all().values_list('id')[ _f : _t ])
  party_ids = list(Party.objects.all().values_list('id'))
  # print(Person.objects.filter(party_id__in = party_ids).filter(q_obj).query)
  persons = list(Person.objects.filter(party_id__in = party_ids).filter(q_obj).values())
  print(persons)
  return JsonResponse( { 'message' : 'success', 'qs' : persons } )

def searchPersonOnAccessLevel(request):

  return JsonResponse({ 'message' : 'success', 'qs' : [] })







# def allGroupAppModule(pg_ids):
#   _qs = {}
#   if pg_ids == '':
#     _qs = GroupAppModules.objects.all().select_related('group', 'app_module', 'group_access' )
#   else:
#     _qs = GroupAppModules.objects.filter(group_id__in = pg_ids).select_related('group', 'app_module', 'group_access' )

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



# def getAppModulesStruc( app_module_defn ):
#   app_modules = list(AppModules.objects.all().values())
#   _q1 = {}
#   # adding childNode key
#   for x in app_modules:
#     x['childNodes'] = []
#     try:
#       x['defn'] = app_module_defn[ x['id'] ]
#     except:
#       x['defn'] = None
#     _q1[ x['id'] ] = x
#   # putting the object on its parent
#   for x in app_modules:
#     if x['parent_id'] > 0 :
#       _q1[ x['parent_id'] ]['childNodes'].append( x )
  
#   _f = {}
#   # getting only parents with its child
#   for x in _q1:
#     if _q1[x]['parent_id'] == 0:
#       _f[_q1[x]['id']] = _q1[x]
  
#   return _f  
