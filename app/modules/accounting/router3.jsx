import React from 'react';
import {Route} from 'react-router';
import Accounting from './idx';
import OrgGLAccount from './containers/org-gl-account';
import UpdateOrgGLAccount from './containers/org-gl-accountform';

const accountingRoutes3 = (
  <Route path = 'accounting' component = { Accounting }>
    <Route path = 'orgglaccount/view/:page/:limit' component = { OrgGLAccount }/>
    <Route path = 'orgglaccount/moreinfo/:id' component = { UpdateOrgGLAccount }/>
    <Route path = 'orgglaccount/add' component = { UpdateOrgGLAccount }/>
  </Route>
)

export default accountingRoutes3;