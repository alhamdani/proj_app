import React from 'react';
const FA = require('react-fontawesome');
import {Link} from 'react-router';

export default class VerticalNavListItem extends React.Component{
    constructor(props) {
      super(props);
      this.state = { 	visible: false };
    }
    componentDidMount(){
        
    }
    toggleChildVisibility(){
      let { visible } = this.state;
      this.setState({visible : !visible});
    }
    render(){
        let _child = [];
        let { node, hierarchyUrl, isRoot } = this.props;
        let { visible } = this.state;
        let list_content = '';
        if( node.childNodes.length ){
          let childList = node.childNodes.map( ( item, idx ) => {
            let _url = hierarchyUrl+'/'+item.url;
            return (
              <VerticalNavListItem key = { idx } node = { item } isRoot = { false } hierarchyUrl = { _url } />
            )
          });
          list_content = (
            <li>
              <label onClick = { this.toggleChildVisibility.bind(this) } > 
                { node.description }
                <FA name = { visible ? 'angle-down' : 'angle-left' }/>
              </label>
              <ul style = { ( { display : visible ? 'block' : 'none' } ) }>
                { childList }
              </ul>
            </li>
          )
        }else{
          let linkUrl = hierarchyUrl +'/view/1/20';
          list_content = (
            <li>
              <label> 
                <Link to = { linkUrl }>
                  { node.description }
                </Link>
              </label>
            </li>
          )
        }
        
        return(
            <ul>
              { list_content }
            </ul>
        )
    }
}