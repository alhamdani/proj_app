from django.conf.urls import url
from .partyViews import *
urlpatterns = [
    url(r'^getallperson/$', getAllPerson, name = 'get_all_employee'),
    url(r'^getallpersoncount/$', getAllPersonCount, name = 'get_all_person_count'),

    url(r'^searchonparty/$', searchOnParty, name = 'search_on_party'),

    url(r'^getinfo/$', getInfo, name = 'get_info'),
    url(r'^savenewinfo/$', saveNewInfo, name = 'save_new_info'),

    url(r'^savenewentry/$', saveNewEntry, name = 'save_new_entry'),
    
    url(r'^getpersonstatuses/$', getPersonStatuses, name = 'get_person_statuses'),
    url(r'^getpersontatus/$', getPersonStatus, name = 'get_person_status'),

    url(r'^deleteselected/$', deleteSelected, name = 'delete_selected' ),

    url(r'^getpersoninfo/(?P<person_id>\d+)/$', getPersonInfo, name = 'get_person_info'),

    

    # below if for user access
    # not needed
    url(r'^addandeditfields/$', addAndEditFields, name = 'adding_info'),
]