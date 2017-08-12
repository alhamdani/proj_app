import React from 'react';
import { inject, observer } from 'mobx-react';
import {Link} from 'react-router';

@inject( 'access' ) @observer
export default class HorizontalNav extends React.Component{
  constructor(props){
    super(props);
  }
  updateSideNav( _url ){
    this.props.access.setActiveModules( _url );
  }
  constructList(){
    let temp_arr = [];
    let { _headers } = this.props.access;
    _headers.forEach((item,idx)=>{
      temp_arr.push(
        <li key = { idx }>
          <Link to = { item.url } onClick = { this.updateSideNav.bind(this, item.url ) }>
            { item.description }
          </Link>
        </li>
      )
    });
    return temp_arr;
  }
  updateVerticalNav( h_nav_id ){
    this.props.access.updateSideNavList(h_nav_id);
  }
  constructHeaderNav(){
    let { _horizontal_nav_list, _logged_module_ids } = this.props.access;
    let _arr = [];
    _horizontal_nav_list.forEach((item,idx)=>{
      if( _logged_module_ids.indexOf(item.id) >= 0 ){
         _arr.push(
          <li key = { idx }>
            <Link to = { item.url } onClick = { this.updateVerticalNav.bind(this, item.id ) }>
              { item.description }
            </Link>
          </li>
        )
      }
    })
    return _arr;
  }
  render(){
    let { isAccessLoaded, _headers } = this.props.access;
    let content_list = [];
    if( isAccessLoaded ){
      content_list = this.constructHeaderNav();
    }
    return(
      <ul>
        { content_list }
      </ul>
    )
  }
}