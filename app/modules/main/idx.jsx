import React from 'react';

export default class MainMaster extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Main</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}