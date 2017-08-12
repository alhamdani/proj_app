import React from 'react';
import {Route} from 'react-router';
import Order from './headerTitle';
import OrderHeaderForm from '../../../document/containers/orderform';
import OrderHeader from '../../../document/containers/order';
// import UpdateGLAccount from './containers/chart-of-accountsform';

const orderRoutes = (
  <Route path = 'documents' component = { Order }>
    <Route path = 'order/view/:page/:limit' component = { OrderHeader }/>
    <Route path = 'order/moreinfo/:id' component = { OrderHeaderForm }/>
    <Route path = 'order/add' component = { OrderHeaderForm }/>
  </Route>
)

export default orderRoutes;