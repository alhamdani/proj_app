import React from 'react';
import NavTree from './nav-tree';
export default class SideNav extends React.Component{
  
  render(){
    let { currentPathUrl, accessLvlTree, userAccess } = this.props;
    return(
      <div className = "side-bar-v1">
        <NavTree 
          userAccess = { userAccess }
            accessLvlTree = { accessLvlTree }
              currentPathUrl = { currentPathUrl }/>
      </div>
    )
  }
}