import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');


@inject( 'headerDetails' ) @observer
export default class HeaderActions extends React.Component{
  constructor(props){
    super(props);
  }
  saveEditIcon(){
    let { isEditing } = this.props;
    if(isEditing){
      return ( <FA name = 'save' onClick = { this.props.toggleEditing.bind(this) } /> );
    }else{
      return ( <FA name = 'pencil' onClick = { this.props.toggleEditing.bind(this) }/> );
    }
  }
  render(){
    let editSaveIcon = this.saveEditIcon();
    let { isForAddingHeaderDetails } = this.props.headerDetails;
    let content = '';

    if( isForAddingHeaderDetails ){
      content = (
        <ul className = 'axn'>
          <li><FA name = 'save'/></li>
        </ul>
      )
    }else{
      content = (
        <ul className = 'axn'>
          <li>{editSaveIcon}</li>
          <li><FA name = 'trash'/></li>
          <li><FA name = 'refresh'/></li>
          <li ><FA name = 'edit'/></li>
        </ul>
      )
    }
    return(
      <div className = 'hdr-axn'>
        { content }
      </div>
    )
  }
}