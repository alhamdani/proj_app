import React from 'react';

export default class Documents extends React.Component{
  render(){
    return(
      <div>
        <div className = 'path-header'>
          <span>Documents</span>
        </div>
        <div>
          { this.props.children }
        </div>
      </div>
    )
  }
}