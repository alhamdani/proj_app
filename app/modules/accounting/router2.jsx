import React from 'react';
import {Route} from 'react-router';
import Accounting from './idx';
import AccountingPeriod from './containers/acctg-period';
import UpdateAccountingPeriod from './containers/acctg-periodform';

const accountingRoutes2 = (
  <Route path = 'accounting' component = { Accounting }>
    <Route path = 'acctgperiod/view/:page/:limit' component = { AccountingPeriod }/>
    <Route path = 'acctgperiod/moreinfo/:id' component = { UpdateAccountingPeriod }/>
    <Route path = 'acctgperiod/add' component = { UpdateAccountingPeriod }/>
  </Route>
)

export default accountingRoutes2;