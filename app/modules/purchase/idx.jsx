import React from 'react';

export default class Purchase extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Purchase</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}