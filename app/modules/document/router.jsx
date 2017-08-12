import React from 'react';
import {Route} from 'react-router';
import Documents from './idx';

import PurchaseOrder from './order/containers/purchase-order';
import SalesOrder from './order/containers/sales-order';

import SalesInvoice from './sales/containers/sales-invoice';



const accountingRoutes = (
  <Route path = 'documents' component = { Documents }>
    <Route path = 'sales/salesinvoice/view/:page/:limit' component = { SalesInvoice }/>

    <Route path = 'order/salesorder/view/:page/:limit' component = { SalesOrder }/>

    <Route path = 'order/purchaseorder/view/:page/:limit' component = { PurchaseOrder }/>
    
  </Route>
)

export default documentsRouter;