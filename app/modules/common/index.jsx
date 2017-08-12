import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Provider, observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';
import { Link } from 'react-router';

import userAccess from './stores/user-access';
import access from './stores/access';
import headerDetails from './stores/header-detail-store';



import headerStore from './stores/header-store';
import treeNavAccess from './stores/tree-nav-access';

import appTable from './stores/app-table-store';
import appForm from './stores/app-form-store';
import appTab from './stores/app-tab-store';

// import personStore from '../party/store';
import tabTableStore from './stores/tab-table-store';

import MainLayout from './containers/main-layout';


require('../../static/css-practice/css-practice.css');

import actionMenuStore from './stores/action-menu-store';

class HomeComponent extends Component{
  render(){
    return(
      <div>
        <h2> Home Page </h2>
      </div>
    );
  }
}

class ProductComponent extends Component{
  render(){
    return (
      <div>
        <h2>Product</h2>
      </div>
    )
  }
}

class AmescoAmindComponent extends Component{
  render(){
    return (
      <div>
        <h2>Amesco Admin</h2>
      </div>
    )
  }
}



class SampleComponent extends Component{
  render(){
    return (
      <div>
        <h2>Amesco Admin</h2>
      </div>
    )
  }
}


import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Container from 'muicss/lib/react/container';

class TestComponent extends Component{
  render(){
    return(
     <Container fluid={true}>
        <Row>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
          <Col md="1">md-1</Col>
        </Row>
        <Row>
          <Col md="8">md-8</Col>
          <Col md="4">md-4</Col>
        </Row>
        <Row>
          <Col md="4">md-4</Col>
          <Col md="4">md-4</Col>
          <Col md="4">md-4</Col>
        </Row>
        <Row>
          <Col md="6">md-6</Col>
          <Col md="6">md-6</Col>
        </Row>
      </Container>
    )
  }
}


import { partyRoute } from '../party/route';

import PartyLayout from '../party/containers/party-layout';
import PartyList from '../party/containers/party-list';

import PersonView from '../party/containers/person';
import PersonInfo from '../party/containers/person-info';
import PartyHome from '../party/containers/party-home';

import AccessLevelComponent from './containers/access-level';
import AppPagesComponent from './containers/app-pages';
import errorPageAccess from './containers/error-page-access';
import AddressTypeComponent from '../admin/containers/address-type';

import Roletype from '../admin/containers/roletype';


// admin
import AllEmployeeComponent from '../admin/containers/all-employee';

class sampleComponentHome extends Component{
  render(){
    return(
      <div>Sample Home</div>
    )
  }
}
class SampleComponentLayout extends Component{
  render(){
    return (
      <div>
        { this.props.children }
      </div>
    )
  }
}
@inject('userAccess') @observer
class thirdLevelChildComponent extends Component{
  componentDidMount(){
    let {location} = this.props;
    this.props.userAccess.pathAccessLevelKeyCode( location.pathname );
  }
  render (){
    // console.log('userAccess', this.props.userAccess)
    // console.log(this.props.userAccess.access_level)
    return (
      <div>I am the third level child</div>
    )
  }
}
@inject('userAccess') @observer
class anotherLevel extends Component{
  componentDidMount(){
    let {pathname} = this.props.location;
    // console.log()
    if( !this.props.userAccess.checkAccess( pathname ) ){
      this.props.router.replace('error')
    }
    this.props.userAccess.pathAccessLevelKeyCode( pathname );
  }
  render (){
    return (
      <div>I am the third level child</div>
    )
  }
}

import MainMaster from '../main/idx';

import Person from '../main/party/person/containers/person';
import UpdatePerson from '../main/party/person/containers/update-person';

import Relationship from '../main/party/relationship/containers/relationship';

import Product from '../main/product/containers/product';


import Documents from '../documents/idx';

// import documentsRouter from '../document/router';


import Purchase from '../purchase/idx';
import PurchaseOrder from '../purchase/purchaseorder/containers/purchase-order';
import PurchaseReturn from '../purchase/purchasereturn/containers/purchase-return';
import RecievingReport from '../purchase/recievingreport/containers/recieving-report';





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Accounting - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
import Accounting from '../accounting/idx';


import accountingRoutes from '../accounting/router';
import accountingRoutes2 from '../accounting/router2';
import accountingRoutes3 from '../accounting/router3';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  end of Accounting - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//----------------------------------------------------Document Order----------------------------------
import orderRoutes from '../document/templates/documentHeader/headerRouter';
//----------------------------------------------------------------------------------------------------



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  security - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
import Security from '../security/idx';
import Access from '../security/access/containers/access';
import AccessLevel from '../security/accesslevel/containers/access-level';
import AppModule from '../security/appmodule/containers/app-module';
import Group from '../security/group/containers/group';
import GroupAccess from '../security/groupaccess/containers/group-access';
import EditAccessLevel from '../security/accesslevel/containers/edit-access-level';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  end of security - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


ReactDOM.render(
  <Provider 
    userAccess = { userAccess } 
      headerStore = { headerStore } 
        tabTableStore = { tabTableStore }
          actionMenuStore = { actionMenuStore }
            treeNavAccess = { treeNavAccess }
              appTable = { appTable }
                appForm = { appForm }
                  appTab = { appTab }
                    access = { access }
                      headerDetails = { headerDetails }>
    <Router history = { hashHistory }>
      <Route path = '/' component = { MainLayout }>
        <Route path = 'party' component = { PartyLayout }>
          <IndexRoute component = { PartyHome }></IndexRoute>
          <Route path ='party-list' component = { PartyList }></Route>
          <Route path = 'person' component = { PersonView }></Route>
          <Route path = 'person-info/:personId' component = { PersonInfo }></Route>
        </Route>

        <Route path = 'amescoadmin' component = { AmescoAmindComponent }></Route>
        <Route path = 'amescoadmin/accesslevel' component = { AccessLevelComponent }></Route>
        <Route path = 'amescoadmin/appspages' component = { AppPagesComponent }></Route>
        <Route path = 'amescoadmin/allemployee' component = { AllEmployeeComponent }></Route>
        <Route path = 'amescoadmin/roletype' component = { Roletype }></Route>

        <Route path = 'amescoadmin/addresstype' component = { AddressTypeComponent }></Route>
        
        {/*  > > > > > > > > on main < < < < < < < < < < */}
        <Route path = 'master' component = { MainMaster }>
          {/* - - - - - - - - party - - - - - - - - - - */}

            {/* + + + + + + + Person + + + + + + + + + */}
            <Route path = 'party/person' component = { Person } />
            <Route path = 'party/person/view/:page' component = { Person } />
            <Route path = 'party/person/view/:page/:limit' component = { Person } />
            

            <Route path = 'party/person/moreinfo/:id' component = { UpdatePerson } />
            <Route path = 'party/person/add' component = { UpdatePerson } />
            {/* + + + + + + + Relationship + + + + + + + + + */}
            <Route path = 'party/relationship' component = { Relationship } />
          



          {/* - - - - - - - - product - - - - - - - - - - */}
            <Route path = 'product' component = { Product } />
            <Route path = 'product/view/:page/:limit' component = { Product } />



        </Route>
        {/*  > > > > > > > > on main < < < < < < < < < < */}

        <Route path = 'documents' component = { Documents }></Route>

        <Route path = 'purchase' component = { Purchase }>
          <Route path = 'purchaseorder/view/:page/:limit' component = { PurchaseOrder } />
          <Route path = 'recievingreport/view/:page/:limit' component = { RecievingReport } />
        </Route>

        <Route path = 'security' component = { Security }>
          <Route path = 'accesslevel/view/:page/:limit' component = { AccessLevel } />
          <Route path = 'accesslevel/moreinfo/:id' component = { EditAccessLevel } />
          <Route path = 'appmodule/view/:page/:limit' component = { AppModule } />
          <Route path = 'group/view/:page/:limit' component = { Group } />
          <Route path = 'access/view/:page/:limit' component = { Access } />
          <Route path = 'groupaccess/view/:page/:limit' component = { GroupAccess } />
        </Route>

        { accountingRoutes }
        { accountingRoutes2 }
        { accountingRoutes3 }  
        
        { orderRoutes }


        <Route path = 'home' component = { HomeComponent }></Route>
        <Route path = 'product' component = { ProductComponent }></Route>
        <Route path = 'sample' component = { SampleComponentLayout }>
          <IndexRoute component = { sampleComponentHome }/>
          <Route path = 'pageone/p11/p111' component = { thirdLevelChildComponent }></Route>
          <Route path = 'pagetwo' component = { anotherLevel }></Route>
        </Route>
      </Route> 
      <Route path = 'error' component = { errorPageAccess }></Route>
    </Router>
  </Provider>
  ,document.getElementById('main-content')
);























// css files
// import '../../static/css-practice/css-practice.css';
// import '../../static/bootstrap/css/bootstrap.css'; // bootstrap grid only

// custom component
// import NavTree from './container/nav-tree';
// import SideNav from './container/side-nav';

/*
  var tree = [
    {
      title: "howdy",
      childNodes: [
        {
          title: "bobby", 
          childNodes : [
            {
              title : "nothing",
              childNodes : [
                {
                  title : 'new child',
                  childNodes : []
                }
              ]
            }
          ]
        },
        {
          title: "suzie", 
          childNodes: [
            {
              title: "puppy", 
              childNodes: [
                {
                  title: "dog house"}
                ]
            },
            {
              title: "cherry tree"
            }
          ]
        }
      ]
    },
    {
      title: "howdy",
      childNodes: [
        {
          title: "bobby", 
          childNodes : [
            {
              title : "nothing",
              childNodes : [
                {
                  title : 'new child'
                }
              ]
            }
          ]
        },
        {
          title: "suzie", 
          childNodes: [
            {
              title: "puppy", 
              childNodes: [
                {
                  title: "dog house"}
                ]
            },
            {
              title: "cherry tree"
            }
          ]
        }
      ]
    }
  ]
*/

/*
  let tree = [
    {
      'title' : 'Nav one',
      'url' : '/pageone',
      'childNodes' : [
        { 'title' : 'sub nav one', 'url' : '/pageone/subone' },
        { 'title' : 'sub nav two', 'url' : '/pageone/subtwo' }
      ]
    },
    {
      'title' : 'Nav Two',
      'url' : '/pagetwo',
      'childNodes' : [
        { 'title' : 'sub nav one', 'url' : '/pagetwo/subone' },
        { 'title' : 'sub nav two', 'url' : '/pagetwo/subtwo' }
      ]
    }
  ]
*/
/*
class PageLayout extends Component{
  render(){
    return (
      <div>
        <div className = "row">
          <div className = "col-sm-12">
           
          </div>
        </div>
        <div className = "row">
          <div className = "col-sm-2">
            <NavTree tree = { tree } />
          </div>
          <div className = "col-sm-8">

          </div>
        </div>
      </div>
    ) // return 
  } // render
} // PageLayout
*/

/*
  class MainBody extends Component{
    render(){
      console.log(this.props.children);
      return ( 
        <div>
          <h1>Main Body Header</h1>
          <div className = 'col-sm-2'>
              <ul>
                <li><Link to = 'home'>Home Body</Link></li>
                <li><Link to = 'somebody'>Some Body</Link></li>
              </ul>
          </div>
          <div className = 'col-sm-10'>
            { this.props.children }
          </div>
        </div>
      );
    }
  }

  class TestBody extends React.Component{
    render(){
      return(<div> Testing for working body </div>);
    }
  }

  class HomeBody extends Component{
    render(){
      return (<div> Home body </div>)
    }
  }

  class AnotherBody extends Component{
    render(){
      return (<div> Another one to test the body</div>);
    }
  }
  @inject('userAccess') @observer
  class Nav extends Component{
    componentDidMount(){
      console.log('component Did Mounted');
      this.props.userAccess.getPageTree
    }
    render(){
      return ( 
        <div>
          <h2> - - - Nav  - - - </h2>
          <ul>
            <li><Link to = '/nav'>Nav</Link></li>
            <li><Link to = '/nav-sub1'>Nav Sub 1</Link></li>
            <li><Link to = '/nav-sub2'>Nav Sub 2</Link></li>
          </ul>
          <div>
            { this.props.children }
          </div>
        </div>
      )
    }
  }

  class Def1 extends Component{
    render(){
      return ( <div> Def 1 </div> );
    }
  }

  class NavSub1 extends Component{
    render(){
      return ( <div>Nav Sub 1</div> );
    }
  }

  class NavSub2 extends Component{
    render(){
      return ( <div>Nav Sub 2</div>);
    }
  }

  class Nav2 extends Component{
    render(){
      return( <div>Nav 2</div> );
    }
  }

  class Def2 extends Component{
    render(){
      return ( <div> Def 2 </div> );
    }
  }

  class Nav2Sub1 extends Component{
    render(){
      return( <div>Nav 2 Sub 2</div> );
    }
  }

  class Nav2Sub2 extends Component{
    render(){
      return ( <div>Nav 2 Sub 2</div> );
    }
  }

  class ParDef1 extends Component{
    render(){
      return ( 
        <div> 
          Parent Def 1 
        </div> 
      );
    }
  }

  class Parent1 extends Component{
    render(){
      return (
        <div>
          <h2>I am the parent 1</h2>
          <ul>
            <li><Link to = '/'>Parent default 1</Link></li>
            <li><Link to = 'nav'>Nav</Link></li>
            <li><Link to = 'nav2'>Nav 2</Link></li>
          </ul>
          <div>
            { this.props.children }
          </div>
        </div>);
    }
  }

ReactDOM.render(
  <Provider userAccess = { UserAccess }>
    <Router history = { hashHistory }>
      <Route path = '/' component = { Parent1 }>
        <IndexRoute component = { ParDef1 }></IndexRoute>
        <Route path = '/nav' component = { Nav }>
          <IndexRoute component = { Def1 }></IndexRoute>
          <Route path = '/nav-sub1' component = { NavSub1 }></Route>
          <Route path = '/nav-sub2' component = { NavSub2 }></Route>
        </Route>
        <Route path = 'nav2' component = { Nav2 }>
          <IndexRoute component = { Def2 }></IndexRoute>
          <Route path = 'nav2-sub1' component = { Nav2Sub1 }></Route>
          <Route path = 'nav2-sub2' component = { Nav2Sub2 }></Route>
        </Route>
      </Route>
    </Router>
  </Provider>
  , document.getElementById('main-content'));
*/
