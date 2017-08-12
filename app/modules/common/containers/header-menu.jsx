import React from 'react';
import { Link } from 'react-router';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';

export default class HeaderMenu extends React.Component{
  headerClickHandler(nav){
    this.props.userAccess.updateSideNav(nav);
  }
  render(){
   let { header_nav } = this.props.userAccess;

    let menu_list = [];
    for( let key in header_nav ){
      menu_list.push( 
        <li key = { header_nav[key].url }>
          <Link to = { header_nav[key].url } onClick = { this.headerClickHandler.bind(this, header_nav[key]) } >
            {header_nav[key].name}
          </Link>
        </li>
      )
    }
    menu_list.push( 
      <li key = {menu_list.length}className = 'right-side-header'>
        <div>
          ?
        </div>
      </li>
    )
    return(
      <ul className = 'top-nav-header'>
        { menu_list }
      </ul>
    )
  }
}