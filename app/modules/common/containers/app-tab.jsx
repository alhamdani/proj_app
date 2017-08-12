import React from 'react';
import { observer, inject } from 'mobx-react';
const FA = require('react-fontawesome');

@inject('appTab') @observer
export default class AppTabComponent extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        // this.props.appTab.setActiveTab();
    }
    showTabContent(idx){
        this.props.appTab.setActiveTab(idx);
    }
    render(){
        let { tabs, selectedTabIdx } = this.props.appTab;
        let content = '';
        let tab_titles = [];
        let tab_contents = [];
        tabs.forEach((item, idx)=>{
            let cls = '';
            if( item.isVisible ){
                cls = 'active';
            }
            tab_titles.push(
                <li key = {idx} className = { cls }>
                    <label onClick = { this.showTabContent.bind(this, idx) }>
                        { item.tab_title }
                    </label>
                </li>);
                
            tab_contents.push(
                <div key = {idx} style = {({display : item.isVisible ? 'block' : 'none'})}>
                    { item.tab_component }
                </div>
            )
        });
        
        return(
            <div className ='ap-tab'>
                <ul className = 'tab-hdr'>
                    { tab_titles }
                </ul>
                <div className = 'tab-content'>
                   {tab_contents}
                </div>
            </div>
        )
    }
}


/*

let cls = '';

            if( idx == selectedTabIdx ){
                cls = 'active';
                item.tab_component;
            }
            return (
                <li key = {idx} className = {cls}>
                    <label onClick = { this.showTabContent.bind(this, idx) }>{ item.tab_title }</label>
                    <span className = 'x-icon'><FA name = 'close'/></span>
                </li>
            )
*/