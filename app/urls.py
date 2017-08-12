from django.conf.urls import url, include
from .views import *
urlpatterns = [
  url(r'^$', homePage, name = 'home_page'),



  url(r'^party/',include('app.modules.party.partyUrls')),

  url(r'^', include('app.modules.accounting.urlmain')),
  url(r'^', include('app.modules.document.urlmain')),
  url(r'^', include('app.modules.main.urlmain')),
  url(r'^', include('app.modules.helpers.urlmain')),




  url(r'^getallorg/$', getAllOrg, name = 'get_all_org'),
  url(r'^addorg/$', addOrg, name = 'all_org'),
  url(r'^updateorg/$', updateOrg, name = 'update_org'),
  url(r'^deleteorg/(?P<org_id>\d+)/$', deleteOrg, name = 'delete_org'),
  url(r'^getuseraccess/$', getUserAccess, name = 'get_user_access' ),
  url(r'^getallaccesslevel/$', getAllAccessLevel, name = 'get_all_access_level'),
  url(r'^getallemployee/$', getAllEmployee, name = 'get_all_employee'),

  url(r'^getemployeeonrange/$', getEmployeeOnRange, name = 'get_employee_on_range'),
  url(r'^getemployeecount/$', getEmployeeCount, name = 'get_employee_count'),
  url(r'^searchemployee/$', searchEmployee, name = 'search_employee'),
  url(r'^countsearchemployee/$', countSearchEmployee, name = 'count_search_employee'),

  url(r'^getallpersononrange/$', getAllPersonOnRange, name = 'get_all_person_on_range'),
  url(r'^savenewperson/$', saveNewPerson, name = 'save_new_person'),
  
  url(r'^deleteselectedperson/$', deleteSelectedPerson, name = 'delete_selected_person'),
  
  url(r'^getallpersonaccesslevel/$', getAllPersonAccessLevel, name = 'get_all_person_access_level'),
  
  url(r'^updateempaccess/$', updateEmpAccess, name = 'update_emp_access'),

  url(r'^getallstatus/$', getAllStatus, name = 'get_all_status'),


  url(r'^getallheadersaccess/$', getAllHeadersAccess, name = 'get_all_headers_access'),
  url(r'^getallnavaccess/$', getAllNavAccess, name = 'get_all_nav_access'),

  

  url(r'^getloggedinuseraccess/$', getLoggedInUserAccess, name = 'get_logged_in_user_access'),

  



  url(r'^testurl/$', testUrl, name = 'test_url'),
  url(r'^getallgender/$', getallgender, name = 'getallgender'),
  url(r'^getallsome/$', getallsome, name = 'getallsome'),
  url(r'^getallanother/$', getallanother, name = 'getallanother'),
  
  url(r'^getalllookup/$', getalllookup, name = 'getalllookup'),
  


  
]