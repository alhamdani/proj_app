from django.conf.urls import url
from .mainViews import *

urlpatterns = [
  url(r'^getgroupontyped/$', getGroupOnTyped, name = 'getgroupontyped'),
  url(r'^savenewpersongroup/$', saveNewPersonGroup, name = 'savenewpersongroup'),

  url(r'^savenewgroupdefinition/$', saveNewGroupDefinition, name = 'save_new_group_definition'),
  url(r'^getallgroups/$', getAllGroups, name = 'getallgroups'),
  url(r'^getallgroupandpersongroup/$', getAllGroupAndPersonGroup, name = 'getallgroupandpersongroup'),


  url(r'^getgroupmoduledid/$', getGroupModuleId, name = 'get_group_module_id'),
  url(r'^getappmodulesaxstree/$', getAppModulesAxsTree, name = 'get_app_module_axs_tree'),
  url(r'^getgroupmodulesandaxs/$', getGroupModulesAndAxs, name = 'get_group_modules_and_axs'),
  url(r'^getpersoninfo/$', getPersonInfo, name = 'get_person_info'),
  url(r'^savenewpartylevelaccess/$', saveNewPartyLevelAccess, name = 'save_new_party_level_access'),
  url(r'^countallroletype/$', countAllRoletype, name = 'count_all_roletype'),
  url(r'^countsearchedroletype/$', countSearchedRoletype, name = 'count_searched_roletype'),
  url(r'^getroletypeonrange/$', getRoletypeOnRange, name = 'get_roletype_on_range'),

  url(r'^getroletypeinfo/$', getRoletypeInfo, name = 'get_roletype_info'),
  url(r'^getpartyinfo/$', getPartyInfo, name = 'get_party_info'),
  url(r'^getallpartyonrange/$', getAllPartyOnRange, name = 'get_all_party_on_range'),

  url(r'^getpersonaccess/$', getPersonAccess, name = 'get_person_access'),

  url(r'^searchpersononrange/$', searchPersonOnRange, name = 'search_person'),
  
  url(r'^searchpersononaccesslevel/$', searchPersonOnAccessLevel, name = 'search_person_on_access_level'),

]