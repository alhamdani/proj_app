import React from 'react';
import { inject, observer } from 'mobx-react';

import {Link} from 'react-router';

@inject( 'access' ) @observer
export default class VerticalNav extends React.Component{
    constructor(props){
        super(props);
    }
    makeHierarchyList( obj ){
        
    }
    
    constructVerticalNav(){
        let { _vertical_nav_list, _logged_module_ids } = this.props.access;
        let { childNodes } = _vertical_nav_list;
        let _arr = [];
        if( childNodes !== undefined ){
            for( let x = 0; x < childNodes.length; x++ ){
                let _url = _vertical_nav_list.url+'/'+childNodes[x].url;
                _arr.push(
                    <VerticalNavItem key = { x }
                        mods = { childNodes[x] } 
                            hierarchyUrl = { _url } 
                                logged_module_ids = { _logged_module_ids }/> );
            }
        }
        return _arr;
    }
    render(){
        let { isAccessLoaded, _modules } = this.props.access;
        let nav = [], verticalNav = [];
        if( isAccessLoaded ){
            verticalNav = this.constructVerticalNav();
        }
        return(
            <ul>
                { verticalNav }
            </ul>
        )
    }
}
class VerticalNavItem extends React.Component{
    constructor(props){super(props);}
    constructChildContent(){
        let { mods, hierarchyUrl, logged_module_ids } = this.props;
        let _child_content = '';
        if( logged_module_ids.indexOf(mods.id) >= 0 ){
            if( mods.childNodes.length ){
                let _child = mods.childNodes.map((item, idx)=>{
                    let _url = hierarchyUrl+'/'+item.url;
                    return (
                        <VerticalNavItem key = { idx }
                            mods = { item } 
                                hierarchyUrl = { _url }
                                    logged_module_ids = { logged_module_ids } /> );
                });
                _child_content = ( <ul>{_child}</ul>);
            }
        }
        
        return _child_content;
    }

    constructLink(){
        let { mods, hierarchyUrl,logged_module_ids } = this.props;
        if( logged_module_ids.indexOf(mods.id) >= 0 ){
            return (
                <Link to = {(hierarchyUrl+'/view/1/20' )}> { mods.description } </Link>
            )
        }else{
            return '';
        }
        
    }

    render(){
        
        let _child_content = this.constructChildContent();
        let _link = this.constructLink();
        return(
            <li> {_link} {_child_content} </li>
        )
    }
}




/*
import VerticalNavListItem from './vertical-nav-list-item';

export default class VerticalNav extends React.Component{
    constructor(props){
        super(props);
    }
    makeHierarchyList( obj ){
        
    }
    constructList(){
        let { _modules, accessOnActive } = this.props.access;
        
        let { childNodes } = accessOnActive;
        let _arr = [];
        if( childNodes !== undefined ){
            for( let x = 0; x < childNodes.length; x++ ){
                let _url = accessOnActive.url+'/'+childNodes[x].url;
                _arr.push(
                    <VerticalNavListItem key = { x } 
                        node = { childNodes[ x ] } 
                            hierarchyUrl = { _url } />);
            }
        }else{
            console.log('vertical nav childNodes is undefined')
        }
        return _arr;
    }
    constructVerticalNav(){
        let { _vertical_nav_list } = this.props.access;
        let { childNodes } = _vertical_nav_list;
        let _arr = [];
        for( let x = 0; x < childNodes.length; x++ ){
            let _url = _vertical_nav_list.url+'/'+childNodes[x].url;
            _arr.push(
                <VerticalNavItem key = { x }
                    mods = { childNodes[x] } 
                        hierarchyUrl = { _url } /> );
        }
        return _arr;
    }
    render(){
        let { isAccessLoaded, _modules } = this.props.access;
        let nav = [], verticalNav = [];
        if( isAccessLoaded ){
            nav = this.constructList();
            verticalNav = this.constructVerticalNav();
        }
        return(
            <ul>
                { verticalNav }
            </ul>
        )
    }
}

*/