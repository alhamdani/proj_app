import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';


class Reports extends Component{
  render(){
    return (
      <div>Reports Page</div>
    )
  }
}

class Dtr extends Component{
  render(){
    return (
      <div>DTR Page</div>
    )
  }
}
import PartyLayout from './containers/party-layout';
import PartyList from './containers/party-list';

import PersonView from './containers/person';
import PersonInfo from './containers/person-info';

import PartyHome from './containers/party-home';

const partyRoute = (
   <Route path = 'party' component = { PartyLayout }>
    <IndexRoute component = { PartyHome }></IndexRoute>
    <Route path ='party-list' component = { PartyList }></Route>
    <Route path = 'person' component = { PersonView }></Route>
    <Route path = 'person-info/:personId' component = { PersonInfo }></Route>
  </Route>
)
export { partyRoute };