import React from 'react';
import { inject, observer } from 'mobx-react';
import HeaderMenu from './header-menu';
import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Container from 'muicss/lib/react/container';
import SideNav from '../../common/containers/side-nav';
const FA = require('react-fontawesome');

import VerticalNav from './vertical-nav';
import HorizontalNav from './horizontal-nav';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

import {Link} from 'react-router';
@inject('headerStore', 'userAccess', 'access' ) @observer
export default class MainLayout extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      removeMe : false
    }
  }
  toggleRemoveMe(){
    let { removeMe } = this.state;
    this.setState({
      removeMe : !removeMe
    })
  }
  componentDidMount(){
    console.log(this.props.router)
    this.props.access.defineUserAccess( this.props.location.pathname ); // when defining its also defining the side navigation
  }
  sideNavUpdater(){
    console.log(this.props.location)
  }
  render(){
    let { header_menu } = this.props.headerStore;
    let { removeMe } = this.state;
    let { location, router } = this.props;
    let content = '';
    if( true ){
      content = (
        <div className = 'main-container'>
          <div className = 'nav-and-pic'>
            <div className = 'pic-and-info'>
              <div className = 'pic'>
                <img src = {require('../img/logo-3.png')} width = '190' height = '50'/>
              </div>
              <div className = 'info'>
                <label>
                  Firstname Lastname
                  <span onClick = {this.toggleRemoveMe.bind(this)}>
                    <FA className = 'icon' name ='navicon'/>
                  </span>
                </label>
                <ul className = 'more' style = { ( {display : removeMe ? 'block' : 'none' } ) } >
                  <li>About me</li>
                  <li>DTR</li>
                  <li>Logout</li>
                </ul>
              </div>
            </div>
            
            <div className = 'vertical-nav'>
              <VerticalNav/>
            </div>
          </div>
          <div className = 'body-container'>
            <div className = 'horizontal-nav'>

              <HorizontalNav sideNavUpdaterFn = { this.sideNavUpdater.bind(this) }/>
              
            </div>
            <div className ='content'>
              { this.props.children }
            </div>
          </div>
        </div>
      );
    }
    return(
      <div>
          { content }
      </div>
    ); // return
  } // render
} // MainLayout
/*
 let access = this.props.userAccess;
    let { header_nav } = this.props.userAccess;
    let current_path_url = this.props.location.pathname;
          <Row>
            <Col md = '12'>
              <Row>
                <HeaderMenu userAccess = { this.props.userAccess } />
              </Row>
            </Col>
            <Col md = '12'>
              <Row>
                <ul className = "bread-crumb">{ bread_crumb }</ul>
              </Row>
              <Row>
                <Col md = '2'>
                  <VerticalNav/>
                  <SideNav 
                    userAccess = { this.props.userAccess }  
                      accessLvlTree = { access_lvl_tree } 
                        currentPathUrl = { current_path_url } />
                </Col>
                <Col md = '10'>
                  { this.props.children }
                </Col>
              </Row>
            </Col>
          </Row>
*/

/* 
              <div className = 'path-header'>
                <span>Sales</span>
                <span>Order</span>
              </div>
              <h3 className = 'content-header'> Sales </h3>
              <div className = 'content-form'>
                <div className = 'form-block'>
                  <div className = 'input sp2'>
                    <label>Name</label>
                    <input type = 'text' />
                  </div>
                  <div className = 'input sp2'>
                    <label>Doctype</label>
                    <input type = 'text' />
                  </div>
                  <div className = 'input sp2'>
                    <label>Company</label>
                    <input type = 'text' />
                  </div>
                  <div className = 'input sp2'>
                    <label>Date</label>
                    <input type = 'text' />
                  </div>
                </div>
                <div className ='form-block'>
                  <div className = 'input'>
                    <label>Location</label>
                    <input type = 'text' />
                  </div>
                </div>
                <div className = 'form-block'>
                  <div className = 'input textarea sp5'>
                    <label>Remarks</label>
                    <textarea rows='5' cols='50'/>
                  </div>
                </div>
              </div>
              <div className = 'content-details'>
                <h5 className = 'content-details-header'>Details</h5>
                <div className = 'content-details-table'>
                  <table>
                    <thead>
                      <tr>
                        <th>Quantity</th>
                        <th>Unit price</th>
                        <th>Unit of measure</th>
                        <th>Delivery date</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>99</td>
                        <td>9999</td>
                        <td>box</td>
                        <td>Rush delivery</td>
                        <td>Rush delivery</td>
                      </tr>
                      <tr>
                        <td>99</td>
                        <td>9999</td>
                        <td>box</td>
                        <td>Rush delivery</td>
                        <td>Rush delivery</td>
                      </tr>
                      <tr>
                        <td>99</td>
                        <td>9999</td>
                        <td>box</td>
                        <td>Rush delivery</td>
                        <td>Rush delivery</td>
                      </tr>
                    </tbody>
                  </table>
                </div>                
              </div>
*/