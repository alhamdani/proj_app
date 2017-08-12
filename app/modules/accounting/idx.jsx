import React from 'react';

export default class Accounting extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Chart of Accounts</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}