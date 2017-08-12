from django.conf.urls import url
from .accountingViews import *

urlpatterns = [
    url(r'^getallglaccount/$', getAllGLAccount, name = 'get_all_gl_account'),
    url(r'^saveglaccount/$', saveGLAccount, name = 'save_gl_account'),
    url(r'^deleteglaccount/$', deleteGLAccount, name = 'delete_gl_account' ),
    url(r'^getallacctgperiod/$', getAllAcctgPeriod, name = 'get_all_acctg_period'),
    url(r'^saveacctgperiod/$', saveAcctgPeriod, name = 'save_acctg_period'),
    url(r'^deleteacctgperiod/$', deleteAcctgPeriod, name = 'delete_acctg_period' ),
]