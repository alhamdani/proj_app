from django.shortcuts import render
from app.models import *
from django.http import HttpRequest,JsonResponse
from django.db.models import Q
import json
import sys

from .helper import *

def allGroupAppModuleOnCustom(party_id): # copied in mainViews.py
  _qs = PartyGroupOnCustom.objects.filter(party_id = party_id).select_related('group', 'app_module', 'group_access' )
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
def getAppModulesStruc( app_module_defn ): # copied on mainViews.py
  app_modules = list(AppModules.objects.all().values())
  _q1 = {}
  # adding childNode key
  for x in app_modules:
    x['childNodes'] = []
    try:
      x['defn'] = app_module_defn[ x['id'] ]
    except:
      x['defn'] = None
    _q1[ x['id'] ] = x
  # putting the object on its parent
  for x in app_modules:
    if x['parent_id'] > 0 :
      _q1[ x['parent_id'] ]['childNodes'].append( x )
  
  _f = {}
  # getting only parents with its child
  for x in _q1:
    if _q1[x]['parent_id'] == 0:
      _f[_q1[x]['id']] = _q1[x]
  
  return _f  

def allGroupAppModule(pg_ids): # copied on mainViews.py
  _qs = {}
  if pg_ids == '':
    _qs = GroupAppModules.objects.all().select_related('group', 'app_module', 'group_access' )
  else:
    _qs = GroupAppModules.objects.filter(group_id__in = pg_ids).select_related('group', 'app_module', 'group_access' )

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

