import React from 'react';
import { browserHistory } from 'react-router';
// import { isAlreadyInUrl } from '../utils/utils';
import {Link} from 'react-router';
const FA = require('react-fontawesome');
export default class NavNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 	visible: true };
  }
  componentDidMount(){ }
  toggleChildVisibility = () => {
    this.setState( { visible: !this.state.visible } );
  };
  updateUrlPathAccess(node){
    console.log(node);
  }
  getNodePathUrl(){
    let { node, hierarchyUrl } = this.props;
    if( hierarchyUrl === undefined ){
      return node.url;
    }else{
      return hierarchyUrl;
    }
  }
  render() {
  	let childNodes;
    let _node = this.props.node;
    let style = { display : this.state.visible ? 'none' : 'block' };
    let nodePathUrl = this.getNodePathUrl();
    let finalUrlLink = _node.parentHeaderUrl + '/' +nodePathUrl;
    let list_display = '';
    
    // if node have child
    if ( _node.childNodes != null && _node.childNodes.length !== 0 ) {
      childNodes = _node.childNodes.map(function(node, index) {
        let _url = nodePathUrl + '/' + node.url;
        return (
        	<li key = { index }>
        		<NavNode 
              node = { node } 
                hierarchyUrl = { _url }/>
          </li>
        )
      }.bind(this));
      // add ul and its children
      list_display = (
        <div className = 'nav-item'>
          <div className = 'nav-label collapsible'>
            <FA name = { this.state.visible ? 'angle-right' : 'angle-down' }/>
            <span className = 'label-text' onClick = { this.toggleChildVisibility }>{ this.props.node.name }</span>
          </div>
          <ul className = 'nav-children' style={ style }> { childNodes } </ul>
        </div>
      );
    }else{
      list_display = (
        <div className = 'nav-item'>
          <div className = 'nav-label'>
            <label>
              <span className = 'label-text'>
                <Link className = 'nav-link' to = { finalUrlLink } onClick = { this.updateUrlPathAccess.bind(this, nodePathUrl) }> { this.props.node.name } </Link>
              </span>
            </label>
          </div>
        </div>
      );
    }
    return (
      <div className = 'nav-item-container'>
        { list_display }
      </div>
    );
  }
}