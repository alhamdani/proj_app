import React from 'react';

export default class Order extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Order</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}