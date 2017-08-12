import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';


import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import Form from 'muicss/lib/react/form';

import TablePagination from './table-pagination';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

@inject( 'actionMenuStore', 'userAccess') @observer
export default class TableView extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      person_count : 0,
      input_value : ''
    }
  }
  componentDidMount(){ 
    let path = this.props.locationPath;
    this.props.userAccess.pathAccessLevelKeyCode(path);
  }
  toggleCheckall(){ 
    this.props.givenStore.toggleSelectedOnCurrentObj();
    let { all_selected } = this.props.givenStore.obj_list;
    this.props.givenStore.obj_list.all_selected = !all_selected;
  }
  updateSelectedItem( item, toRemove ){
    this.props.givenStore.updateSelectedItem(item, toRemove);
  }
  deleteAllSelected(){
    this.props.givenStore.deleteSelectedObj();
  }
  selectedItemCounter( isSelected ){
    this.props.givenStore.counterUpdater( isSelected );
  }
  refreshObjList(){
    this.props.givenStore.resetToDefaultValues();
    this.props.givenStore.getObjList();

    this.setState({ input_value : '' });
    this.refs.search.value = '';
  }
  filterResult(ev){
    if( ev.which === 13 ){
      this.props.givenStore.searchOnObj( ev.target.value );
    }
    this.setState({ input_value : ev.target.value });
  }
  leaveInput( ev ){
    this.setState({ input_value : ev.target.value });
  }
  changeAll(ev){
    let { givenStore } = this.props;
    givenStore.toggleSelectAll();
    let val = givenStore.select_all;
    let selected_count = givenStore.selectedItemCounter;
    givenStore.list_of_obj.forEach(function(item){
      let { selected } = item;
      item.selected = val;
      if( val === true ){ // if selected
        selected_count += 1;
      }else{
        selected_count -= 1;
      }
    });
    givenStore.selectedItemCounter = selected_count;
  }
  changeOne(item, idx, ev){
    let { selected } = item;
    item.selected = !selected;
    this.props.givenStore.checkSelectedChanges();
  }
  editSelectedFn(ev){ this.props.editAllSelected(); }
  viewSelectedFn(ev){ this.props.viewAllSelected(); }
  viewClicked(item){ this.props.showClickedInfo(item); }
  addObj(){ this.props.addObj(); }

  sortObj(item){
    this.props.givenStore.updateFilterFieldSort(item);    
    this.props.givenStore.updateObj();
  }
  render(){
    // let { listHeaderLabel } = this.props;
    let { obj_list, isCounted, isLoaded, obj_list_count, isAllSelected, selectedItemCounter, filterFields } = this.props.givenStore;
    let { input_value } = this.state;
    let table_header = [];
    let objHeader = null;

    let { canAdd, canView, canDelete } = this.props.userAccess.access_level;
    let { isUserAccessLoaded } = this.props.userAccess;

    let { list_of_obj, select_all, queriedAll, all_count, isHeadersSet } = this.props.givenStore;
    let pagination = '';
    let table_row = [];
    if( queriedAll && isHeadersSet ){
      table_header.push(<th key='allToggle'><input type = 'checkbox' checked = { select_all } onChange = {this.changeAll.bind(this)} /></th>);
      filterFields.forEach(function( item, idx ){
        
        let splitted_key = item.name.split('_');
        let label = '';
        for(let x = 0; x < splitted_key.length; x++ ){
          label += splitted_key[x] + ' ';
        }
        let header_icon = '';
        if( item.useToSortKey == 1 ){
          header_icon = 'sort-desc';
        }else if( item.useToSortKey == 2){
          header_icon = 'sort-asc';
        }
        table_header.push( 
          <th key = {idx} className = "table-header" onClick = { this.sortObj.bind(this, item)}>
            { label }
            <span className = 'icon'>
              <FA name = { header_icon }/>
            </span>
          </th> 
        );
      }.bind(this))
      table_row = list_of_obj.map(function(item,idx){
        let tds = [];
        tds.push(<td key = 'cxbox'><input checked = { item.selected } type = 'checkbox' onChange = {this.changeOne.bind(this, item, idx)} /></td>)
        for( let x = 0; x < filterFields.length; x++ ){
          tds.push( <td key = { x }>{item[filterFields[x].name]}</td> );
        }
        return (  <tr style = { ( { cursor : 'pointer' } ) } key = { idx } onDoubleClick = { this.viewClicked.bind( this, item ) }>{tds}</tr> );
      }.bind(this))
      if( table_row.length === 0){
        table_row.push(<tr key = "NoRecords"><td colSpan = { table_header.length }> No Records Found </td></tr>)
      }
      pagination = ( <TablePagination givenStore = { this.props.givenStore }></TablePagination> );
    }
    return(
      <Row>
        <Col md = '12'> 
          <Panel>
            <div className = "table-header">
              <div className = "table-action">
                <div className = "delete axn" style = { ( { display : canDelete ? 'inline' : 'none' } ) }>
                  <button disabled = { ( selectedItemCounter > 0 ? false : true ) } onClick = { this.deleteAllSelected.bind(this) }>
                    <FA name = 'trash-o'/>
                  </button>
                </div>
                <div className = "refresh axn"> 
                  <button onClick = { this.refreshObjList.bind(this) }>
                    <FA name = 'refresh'/>
                  </button> 
                </div>
                <div className = "add axn" style = { ( { display : canAdd ? 'inline' : 'none' } ) }>
                  <button onClick = { this.addObj.bind(this) }>
                    <FA name = 'plus'/>
                  </button> 
                </div>
                <div className = 'input-search'>
                  <input ref = 'search' type = 'text' onKeyPress = { this.filterResult.bind(this) } />
                  <span className = 'icon'>
                    <FA name = 'search'/>
                  </span>
                </div>
                <div className = 'column-filter'>
                  <TableFilter givenStore = { this.props.givenStore }/>
                </div>
              </div>

              { pagination }

            </div>
            <table className = 'tbl-v-1'>
              <thead>
                <tr>
                  { table_header }
                </tr>
              </thead>
              <tbody>
                { table_row }
              </tbody>
            </table>
          </Panel>
        </Col>
      </Row>
    ) // return 
  } // render 
}

@observer
class TableFilter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showFilter : false
    }
  }
  toggleCheckbox(item){
    let {useToFilter} = item;
    item.useToFilter = !useToFilter;
    this.props.givenStore.filterObjOnSelected();
  }
  toggeFilterer(){
    let { showFilter } = this.state;
    this.setState({ showFilter : !showFilter });
  }
  render(){
    let { filterFields } = this.props.givenStore;
    let sorted_list = [];
    let { showFilter } = this.state;
    filterFields.forEach(function(item,idx){
      let lbl = item.name.split('_');
      let label = '';
      for(let x = 0; x < lbl.length; x++){
        label += lbl[x] + ' ';
      }
      sorted_list.push(
        <li key = { idx }>
          <input type = 'checkbox' checked = {item.useToFilter} onChange = { this.toggleCheckbox.bind(this, item)}/>
          <label>{label}</label>
        </li>
      )
    }.bind(this));
    let content = (
      <ul className = "column-chooser" style = { ({ display : showFilter ? 'block' : 'none' } ) }>
        { sorted_list }
      </ul>
    )
    return (
      <div className = "icon-filter" onMouseEnter = { this.toggeFilterer.bind(this) } onMouseLeave = { this.toggeFilterer.bind(this) }>
        <FA name = 'angle-down'/>
        { content }
      </div>
    )
  }
}