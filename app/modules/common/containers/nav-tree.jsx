import React from 'react';
import NavNode from './nav-node';

export default class NavTree extends React.Component{
  accessLevelChecker(){
    
  }
  componentDidMount(){

  }
  render(){
    let tree_nav = [];
    if( this.props.userAccess.isUserAccessLoaded ){
      let { currentPathUrl, userAccess, accessLvlTree } = this.props;
      let tree = accessLvlTree;
      tree_nav = tree.map((item,idx) => {
        return(
          <li key = {idx}>
            <NavNode currentPathUrl = { currentPathUrl } node = { item } />
          </li>
        )
      })
    }
    return (
      <ul className = "side-nav-tree">
        { tree_nav }
      </ul>
    );
  }
}