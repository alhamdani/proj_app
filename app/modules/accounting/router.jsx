import React from 'react';
import {Route} from 'react-router';
import Accounting from './idx';
import ChartOfAccounts from './containers/chart-of-accounts';
import UpdateGLAccount from './containers/chart-of-accountsform';

const accountingRoutes = (
  <Route path = 'accounting' component = { Accounting }>
    <Route path = 'chartofaccount/view/:page/:limit' component = { ChartOfAccounts }/>
    <Route path = 'chartofaccount/moreinfo/:id' component = { UpdateGLAccount }/>
    <Route path = 'chartofaccount/add' component = { UpdateGLAccount }/>
  </Route>
)

export default accountingRoutes;