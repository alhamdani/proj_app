
import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

import DetailTable from './detail-table';


@inject( 'headerDetails' ) @observer
export default class Details extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'tabs' : [],
      'isLoaded' : false,
      'active_tab' : {},
      'data_on_active' : [],
      'selected_count' : 0,
      'isEditing' : false,
      'loading'  : false
    }
  }
  // getData(url){
  //   return axios.get(url);
  // }
  // queryUrls( url ){
  //   return axios.get(url);
  // }
  componentDidMount() {
    let tabs = this.props.headerDetails._tabs;
    this.props.headerDetails.setUpDetails();
    if( tabs.length ){
      let { headerId } = this.props;
      if( headerId != undefined ){
        this.props.headerDetails.setUpHeaderId( headerId );
      }
      this.props.headerDetails.queryOptionUrlsAndUpdateData(); // 
      // let active_tab = this.props.headerDetails._active_tabs;
      // let { onOptions, onLookups } = active_tab;
      // let queries = [];
      // for( let key in onOptions ){
      //   let item = onOptions[key];
      //   queries.push( this.queryUrls(item.url ) );
      // }
     
      this.setState({'isLoaded' : true })
    }
  }
  setTabAsActive( idx ){
    this.props.headerDetails.setTabAsActive( idx );
  }
  constructTabs(){
    let tabs = this.props.headerDetails._tabs;
    let active_tab = this.props.headerDetails._active_tabs;
    let _arr = [];
    tabs.forEach((item,idx)=>{
      let cls = '';
      if( item.name == active_tab.name ){
        _arr.push( <li key = { idx } className = 'active' > {item.label} </li>);
      }else{
        _arr.push( <li key = { idx } onClick = { this.setTabAsActive.bind(this, idx) } > {item.label} </li> )
      }
    })
    return _arr;
  }
  addNewData(){
    window.scrollTo( 0, document.body.scrollHeight ); // scroll down up to the bottom of the page
    let columns = this.props.headerDetails._active_tabs['cols']
    let _obj = {};
    _obj.id = '';
    columns.forEach((item)=>{
      if( item.type == 'lookup' || item.type == 'select' ){
        let _temp = {  };
        _temp.label = '';
        _temp.default_value = '0';

        _obj[item.name] = _temp;
      }else{
        _obj[item.name] = '';
      }
    })
    _obj.toAdd = true;
    _obj.isSelected = false;
    this.props.headerDetails.addNewData( _obj );
  }
  removeData(){
    this.props.headerDetails.deleteSelectedRow();
  }
  toggleEditing(){
    this.props.headerDetails.toggleDetailsEditing();
  }
  submitNewAdded(){
    // this.props.headerDetails.saveNewAdded();
    this.props.headerDetails.saveEdited();
  }
  render(){
    let { isLoaded } = this.state;
    let tab_list = '', tbl = '', saveEditIcon = '', saveNewAddIcon = '', menuAxn = '';
    let { isForAddingHeaderDetails } = this.props.headerDetails;
    if( isLoaded ){
      let { active_tab, data_on_active } = this.state;
      tab_list = this.constructTabs();
      tbl = (  <DetailTable /> );

      if( !isForAddingHeaderDetails ){
        menuAxn = (
          <div className = 'dtl-axn'>
            <ul className = 'axn-grp-1'>
              <li><FA name = 'plus' onClick = { this.addNewData.bind(this) }/></li>
              <li><FA name = 'trash' onClick = { this.removeData.bind(this) } /></li>
              <li><FA name = 'pencil' onClick = { this.toggleEditing.bind(this) } /></li>
              <li><FA name = 'save' onClick = { this.submitNewAdded.bind(this) }/></li>
            </ul>
          </div>
        )
      }
    }
    return (
      <div className = 'hdr-dtl-dtl'>
        
          { menuAxn }
        
        <div>
          <ul className = 'tabs'>
            { tab_list }
          </ul>
        </div>
        { tbl }
      </div>
    )
  }
}

 /*
        axios.all( queries )
          .then( (...args)=>{
            let data = args[0];
            data.forEach((item)=>{
              let _data = item.data.qs;
              try{
                onOptions[_data.name].options = _data.options;
              }catch(e){}
            })
            // console.log(onOptions, onLookups)
            this.getData(active_tab.url)
              .then((rs)=>{
                let data = rs.data.qs;
                // console.log(data);
              
                data.forEach((item)=>{
                  active_tab['cols'].forEach((_item)=>{
                    if(item[_item.name] !== undefined && _item.type == 'lookup'){
                      // console.log(_item.name)
                      item[_item.name] = { 
                        isOptionVisible : false,
                        label : item[_item.name].label,
                        value : item[_item.name].default_value
                      }
                    }
                  })
                  item.isSelected = false;
                  item.isEditing = false;
                });
                let _temp = {};

                active_tab.current_datas = data; // update the tabs object as well as itself
                // console.log(active_tab)
                this.setState({'isLoaded' : true, 'active_tab' : active_tab, 'data_on_active' : data })
              })
          })
        */