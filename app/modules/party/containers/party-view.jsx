import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('userAccess') @observer
export default class PartyView extends React.Component{
  render(){
    let access = this.props.userAccess;
    /**
     *  <div className = 'col-sm-12'>
        <h4> Party Page </h4>
        <div className = 'col-sm-2'>
          <SideNav 
            location = { this.props.location }
            router = { this.props.router } 
            pageAccess = { access.getPageTree }/>
        </div>
        <div className = 'col-sm-10'>
          <div>{ this.props.children }</div>
        </div>
      </div>
     */
    return (
     <div>No content</div>
    );
  }
}