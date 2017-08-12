from django.conf.urls import url
from .accountingViews import *

urlpatterns = [
    #Chart of Accounts
    url(r'^getallglaccount/$', getAllGLAccount, name = 'get_all_gl_account'),
    url(r'^saveglaccount/$', saveGLAccount, name = 'save_gl_account'),
    url(r'^deleteglaccount/$', deleteGLAccount, name = 'delete_gl_account' ),
    url(r'^getglaccount/$', getGLAccount, name = 'get_gl_account' ),
    url(r'^searchglaccount/$', searchGLAccount, name = 'search_gl_account' ),
    url(r'^lookupglaccttype/$', lookupGLAccountType, name = 'lookup_gl_account_type' ),
    #Accounting Period
    url(r'^getallacctgperiod/$', getAllAcctgPeriod, name = 'get_all_acctg_period'),
    url(r'^saveacctgperiod/$', saveAcctgPeriod, name = 'save_acctg_period'),
    url(r'^deleteacctgperiod/$', deleteAcctgPeriod, name = 'delete_acctg_period' ),
    url(r'^getacctgperiod/$', getAcctgPeriod, name = 'get_acctg_period' ),
    url(r'^searchacctgperiod/$', searchAcctgPeriod, name = 'search_acctg_period' ),
    url(r'^lookupperiodtype/$', lookupPeriodType, name = 'lookup_period_type' ),
    #Organizational GL Accounts
    url(r'^getallorgglaccount/$', getAllOrgGLAccount, name = 'get_all_org_gl_account'),
    url(r'^saveorgglaccount/$', saveOrgGLAccount, name = 'save_org_gl_account'),
    url(r'^deleteorgglaccount/$', deleteOrgGLAccount, name = 'delete_org_gl_account' ),
    url(r'^getorgglaccount/$', getOrgGLAccount, name = 'get_org_gl_account' ),
    url(r'^searchorgglaccount/$', searchOrgGLAccount, name = 'search_org_gl_account' ),
    url(r'^lookupparty/$', lookupParty, name = 'lookup_party' ),
    url(r'^lookupglaccount/$', lookupGLAccount, name = 'lookup_glaccount' ),
    url(r'^lookupacctgperiod/$', lookupAccountingPeriod, name = 'lookup_acctg_period' ),
]