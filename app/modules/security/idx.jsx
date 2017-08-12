import React from 'react';

export default class Security extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Security</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}