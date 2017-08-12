from django.conf.urls import url
from .documentViews import *

urlpatterns = [
    url(r'^getalldocumentheader/$', getAlldocumentHeader, name = 'get_all_document_header'),
    url(r'^deletedocumentheader/$', deletedocumentHeader, name = 'delete_document_header' ),
    url(r'^searchdocumentheader/$', searchdocumentHeader, name = 'search_document_header' ),



    url(r'^tab1url/$', tab1url, name = 'tab1url' ),
    url(r'^savetab1url/$', savetab1url, name = 'savetab1url' ),
    url(r'^savenewdatatab1url/$', savenewdatatab1url, name = 'savenewdatatab1url' ),
    url(r'^deletedatatab1url/$', deletedatatab1url, name = 'deletedatatab1url' ),

    url(r'^saveheadernewinfo/$', saveheadernewinfo, name = 'saveheadernewinfo' ),
    

    
    url(r'^tab2url/$', tab2url, name = 'tab2url' ),
    url(r'^tab3url/$', tab3url, name = 'tab3url' ),
    url(r'^tab4url/$', tab4url, name = 'tab4url' ),
    url(r'^tab5url/$', tab5url, name = 'tab5url' ),
    url(r'^tab6url/$', tab6url, name = 'tab6url' ),

    url(r'^sample_q1/$', sample_q1, name = 'sample_q1' ),
    url(r'^sample_q2/$', sample_q2, name = 'sample_q2' ),
    url(r'^sample_q3/$', sample_q3, name = 'sample_q3' ),
    url(r'^sample_q4/$', sample_q4, name = 'sample_q4' ),
    url(r'^sample_q5/$', sample_q5, name = 'sample_q5' ),
    url(r'^sample_q6/$', sample_q6, name = 'sample_q6' ),

    url(r'^getheaderdetail/$', getHeaderDetail, name = 'getheaderdetail' ),
    url(r'^requestonlookup/$', requestonlookup, name = 'requestonlookup' ),
    url(r'^saveedited/$', saveedited, name = 'saveedited' ),
    url(r'^doctypeselect/$', doctypeselect, name = 'doctypeselect' ),
    url(r'^doctypeselect2/$', doctypeselect2, name = 'doctypeselect2' ),
    
    
    
    

]