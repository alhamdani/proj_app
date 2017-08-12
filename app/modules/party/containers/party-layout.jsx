
import React from 'react';
import { inject, observer } from 'mobx-react';

import NavTree from '../../common/containers/nav-tree';

import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Panel from 'muicss/lib/react/panel';

// import ContextMenu from '../../common/containers/context-menu';


export default class PartyLayout extends React.Component{
  render(){
    return (
      <Col md = '12'>
        <div id = 'bound-on-context-menu'>
          { this.props.children }
        </div>
      </Col>
    );
  }
}

/**
 *  showContextMenu(){
    this.props.contextMenuStore.toggleContextMenu();
  }
 <ContextMenu isVisible = { visible } />
        <button onClick = { this.showContextMenu.bind(this) }> Click me</button>

         let { contextMenuStore } = this.props;
    let { visible } = contextMenuStore;
 */