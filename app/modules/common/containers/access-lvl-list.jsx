/*import React from 'react';
import { observer, inject } from 'mobx-react';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export default class AccessLvlListComponent extends React.Component{
  render(){
    let { listTree } = this.props;
    let childList = [];
    for(let x = 0; x < listTree.length; x++ ){
      if( listTree[x].childNodes.length > 0 ){
        childList.push(
          <AccessLvlListComponent listTree = { listTree[x].childNodes }/>
        )
      }
    }
    return (
      <div>
        { listTree.name }
        { childList }
      </div>
    )
  }
}*/