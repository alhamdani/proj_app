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
import Divider from 'muicss/lib/react/divider';

import TableView from './table-view';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";



const FA = require('react-fontawesome');


// @inject('tabTableStore') @observer
export default class TabTableView extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      _selected : null,
      _withAddObjTab : false,
      _tabs : [
        { type : 'list' }
      ]
    }
  }
  onChange(i, value, tab, ev) {/* tabs event  console.log(arguments); */  }
  onActive(tab) {/* tabs event  console.log(arguments);  console.log('evenet')*/  }
  closeTab( idx ){
    let __tabs = this.state._tabs;
    if( idx > 0 ){
      __tabs.splice(idx, 1);
      this.setState( { _tabs : __tabs  } );
    }
  }
  componentDidMount(){
    let _headersLabel = this.props.listHeaderLabel;
    let temp_arr = [];
    _headersLabel.forEach(function(item){
      temp_arr.push( { 'name' : item.name, 'useToFilter' : true, 'useToSortKey' : 0 } );
    })
    this.props.givenStore.setFilterFields( temp_arr );
    this.props.givenStore.getObjList();
  }
  updateTabSelectedIdx( idx ){ this.refs.tabs.setState( { currentSelectedIndex : idx } ); }
  showClickedInfo(item){
    let idx = this.getIdxOfSelected( item );
    if( idx >= 0 ){
      idx = ( idx );
    }else{
      let { _tabs } = this.state;
      _tabs.push({type : 'view', 'data' : item});
      this.setState({_tabs : _tabs});
      // console.log(_tabs.length-1)
      idx = (_tabs.length - 1)
    }
    this.updateTabSelectedIdx( idx );
  }
  onClose( idx, item ) { 
    let __tabs = this.state._tabs;
    if( idx > 0 ){
      __tabs.splice((idx), 1);
      this.setState( { _tabs : __tabs  } );
    }
  }
  getIdxOfSelected(item, _t){
    let { _tabs } = this.state;
    for( let x = 1; x < _tabs.length; x++ ){
      if( _t ){
        if(_tabs[x].type == 'add' ){
          return x;
        }
      }else{
        if( _tabs[x].type == 'view' ){
          if( _tabs[x].data.id == item.id ){
            return x;
          }
        }
      }
    }
    return -1;
  }
  addObj(){
    let { _tabs } = this.state;
    let idx = this.getIdxOfSelected({}, true);
    if( idx < 0 ){
      _tabs.push( { type : 'add' } );
      this.setState({_tabs : _tabs});
      idx = _tabs.length - 1;
    }
    this.updateTabSelectedIdx( idx );
  }
  render(){
    
    let { listHeaderLabel, givenStore, tabLabel, viewInfoHeader, infoOnView } = this.props;
    let { _tabs } = this.state;
    let _tabs_list = [];
    _tabs_list = _tabs.map(function(item,idx){
      let content = '';
      let label = '';
      let value = '';
      if( item.type === 'list' ){
        value = label = 'List';
        content = 
          (<TableView 
            locationPath = { this.props.location.pathname }
              givenStore = { givenStore }
                listHeaderLabel = { listHeaderLabel } 
                  showClickedInfo = { this.showClickedInfo.bind(this) } 
                    addObj = { this.addObj.bind(this) }/>)
      }else if( item.type === 'add' ){
        value = label = 'Add';
        content = (
          <ObjForm 
            givenStore = { givenStore }
              infoOnView = { infoOnView }
                idx = { idx } 
                  closeTabFn = { this.onClose.bind(this) }/> );

      }else if( item.type === 'view' ){
        tabLabel.forEach((itm)=>{label += item.data[itm]+' ';})
        value = label;
        content = (
            <ObjForm 
              Obj = { item.data } 
                listHeaderLabel = { listHeaderLabel }
                  viewInfoHeader = { viewInfoHeader }
                    givenStore = { givenStore } 
                      infoOnView = { infoOnView }
                        idx = { idx }
                          closeTabFn = { this.onClose.bind(this) } /> );
      }
      return(
        <Tab key = { idx } value = { value } label = { label }>
          { content }
        </Tab>
      )}.bind(this))

    return(
      <Col md = '12'>
        <Tabs ref = 'tabs' onClose = { this.onClose.bind(this) } defaultSelectedIndex = { 0 }>
          { _tabs_list }
        </Tabs>
      </Col>
    )
  }
}

@inject( 'userAccess' ) @observer
class ObjForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      all_info : {},
      isInfoLoaded  : false,
      isEditing : false,
      isAdding : false
    }
  }
  componentDidMount(){
    let { givenStore, Obj, infoOnView } = this.props;
    if( Obj !== undefined ){
      let col = givenStore.usePkColumn;
      let { getObjInfo } = givenStore.givenUrls;
      axios.get( getObjInfo, { 'params' : { 'id' : Obj[ col ] } } )
        .then(function(rs){ 
          let info = rs.data.qs;
          let temp_obj = {};
          for( let key in info ){
            if( key !== 'id' ){
              temp_obj[ key ] = info[key];
            }
          }
          this.setState({ isInfoLoaded : true, all_info : temp_obj, isAdding : false });
        }.bind(this));
    }else{
      let temp_obj = this.state.all_info;
      for( let x = 0; x < infoOnView.length; x++ ){
        let _w = infoOnView[x];
        temp_obj[ _w.name ] = '';
      }
      this.setState( { isAdding : true, all_info : temp_obj, isInfoLoaded : true } );
    }
  }
  saveChanges(){
    let { saveNewInfo, saveNewEntry } = this.props.givenStore.givenUrls;
    let { isAdding } = this.state;
    let { idx } = this.props;
    let col = this.props.givenStore.usePkColumn;
    let { Obj, infoOnView } = this.props;
    let { all_info } = this.state;
    if( isAdding ){
      axios.post( saveNewEntry, { 'new_entry' : all_info })
        .then(function(rs){
          this.props.closeTabFn( idx );
        }.bind(this))
    }else{
      axios.post( saveNewInfo, { 'id' : Obj[ col ], 'new_data' : all_info } )
        .then(function(rs){
          this.props.closeTabFn( idx );
        }.bind(this));
    }
  }
  toggleEdit(){
    let { isEditing } = this.state;
    this.setState( { isEditing : !isEditing } );
    if( isEditing ){
      this.saveChanges();
    }
  }
  onChangeInputHandler(col, ev){
    let { all_info } = this.state;
    try{
      all_info[col] = ev.target.value;
    }catch(e){
      all_info[col] = ev;
    }
    this.setState( { all_info : all_info } );
  }
  render(){
    let { Obj, viewInfoHeader, givenStore, infoOnView } = this.props;
    let { isInfoLoaded, all_info, isEditing, isAdding } = this.state;
    let infoHeader = '';
    let content = [];
   
    if( isInfoLoaded ){
      let btn_txt = isEditing ? 'Save' : 'Edit';
      let { canEdit } = this.props.userAccess.access_level;
      if( viewInfoHeader !== undefined ){
        viewInfoHeader.forEach(function(item){
          infoHeader += Obj[item] + ' ';
        });
      }else{
        infoHeader = 'Adding data';
      }
      if( !isAdding && canEdit){
        content.push( 
          <button key = { 'save_edit_btn' } 
            onClick = { this.toggleEdit.bind(this) }>
              { btn_txt }
          </button> );
      }
      for( let x = 0; x < infoOnView.length; x++ ){
        let _w = infoOnView[x]
        let _input = '';
        let _val = all_info[ _w.name ];
        let _lbl = _w.name.split('_');
        let _label = '';
        let value_style = '', input_style = '';
        if( isAdding ){
          value_style = { display : 'none' };
          input_style = { display : 'inline-block' };
        }else{
          value_style = { display : isEditing ? 'none' : 'inline-block' };
          input_style = { display : isEditing ? 'inline-block' : 'none' };
        }
        _lbl.forEach((item)=>{if(item != 'id') _label+=item+' ';});
        if( _w.type == 'select' ){
          content.push( 
            <AutoCompleteInput 
              value_style = { value_style }
                input_style = { input_style }
                  key = { x }
                    updateFkValue = { this.onChangeInputHandler.bind(this) } 
                      col = { _w.name }
                        label = { _label }
                          isEditing = { isEditing }
                            isAdding = { isAdding }
                              info = { infoOnView[x] } 
                                defValId = { _val } /> );
        }else if( _w.type == 'text' ){
          content.push(
            <SimpleInput 
              value_style = { value_style }
                input_style = { input_style }
                  key = { x }
                    defVal = { all_info[ _w.name ] } 
                      col = { _w.name }
                        label = { _label }
                          updateInputFn = { this.onChangeInputHandler.bind(this, ) }/>
          )
        }
      }
      if( isAdding && canEdit ){
        content.push( 
          <button key = {'save_edit_btn'} 
            onClick = { this.saveChanges.bind(this) }>
            Save
          </button>)
      }
    }
    return(
      <Row>
        <Col md = '12'> 
          <Panel>
            <Row>
              <Col md = '12'>
                <div className = "mui--text-dark mui--text-title">{ infoHeader }</div>
                <Divider />
                <br/>
              </Col>
            </Row>
            { content }
          </Panel>
        </Col>
      </Row>
    )
  }
}

class AutoCompleteInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      input_value : '',
      list_choice : [],
      onInput : false
    }
  }
  componentDidMount(){
    let { getAllFkUrl, getFkUrl, labelCol, idKey, isBigData } = this.props.info;
    let { defValId } = this.props;
    if( defValId ){ // if not adding then get the FK value
      axios.get( getFkUrl , { 'params' : { 'key' : idKey, 'value' : defValId } } )
        .then(function(rs){
          let val = rs.data.qs[0][labelCol];
          this.setState({
            input_value : val
          });
        }.bind(this))
    }
    if( !isBigData ){ // if okay to load all
      axios.get( getAllFkUrl, { 'params' : { 'value' : '', 'limit' : 9 } } )
        .then(function(rs){
          // console.log(rs);
              let _li = rs.data.qs;
              let temp_arr = [];
              for( let x = 0; x < _li.length; x++ ){
                let temp_obj = {
                  'label' : _li[x][labelCol],
                  'value' : _li[x][idKey]
                };
                temp_arr.push(temp_obj);
              }
              this.setState( { list_choice : temp_arr } );
            }.bind(this))
    }
    
  }
  changeInput(ev){
    let { isBigData } = this.props.info;
    if( isBigData ){
      let { input_value } = this.state;
      let { getAllFkUrl, labelCol, idKey } = this.props.info;
      let { value } = ev.target;
      if( value !== '' ){
        if( value.length > 2 ){
          axios.get( getAllFkUrl, { 'params' : { 'value' : value, 'limit' : 9 } } )
            .then(function(rs){
              let _li = rs.data.qs;
              let temp_arr = [];
              for( let x = 0; x < _li.length; x++ ){
                let temp_obj = {
                  'label' : _li[x][labelCol],
                  'value' : _li[x][idKey]
                };
                temp_arr.push(temp_obj);
              }
              this.setState( { list_choice : temp_arr } );
            }.bind(this))
        }
      }else{
        this.setState({ list_choice : [] })
      }
      this.setState({  input_value : value })
    }
  }
  toggleOptions(ev){
    let { onInput } = this.state;
    this.setState({onInput : !onInput})
  }
  handleSelected(item){
    this.refs.optionInput.value = item.label;
    this.setState({ input_value : item.label });
    let { col } = this.props;
    this.props.updateFkValue(col, item.value );
  }
  render(){
    let { input_value, list_choice, onInput } = this.state;
    let { isEditing, isAdding, label, value_style, input_style } = this.props;
    let _options = list_choice.map(function(item, idx){
      return ( 
        <li key = { idx } 
          onMouseDown = {this.handleSelected.bind(this, item)}>
            { item.label }
        </li> );
    }.bind(this))
    let _input = (
      <input 
          type = 'text'
            ref = 'optionInput'
              onChange = { this.changeInput.bind(this) } 
                value = { input_value } 
                  onFocus = { this.toggleOptions.bind(this) }
                    onBlur = { this.toggleOptions.bind(this) } /> );

    let _option_container = (
      <ul style = { ( { display : onInput ? 'block' : 'none' } ) }>{ _options }</ul>
    )
    return(
      <Row>
        <Col md = '2'><label>{label}</label></Col>
        <Col md = '8' style = { value_style }>
          <div>{ input_value }</div>
        </Col>
        <Col md = '8' style = { input_style }>
          <div className = 'auto-complete-input'>
            { _input }
            { _option_container }
          </div>
        </Col>
      </Row>
     
    )
  }
}
class SimpleInput extends React.Component{
  constructor( props ){
    super(props);
  }
  onChangeHandler( ev ){
    let { col } = this.props;
    this.props.updateInputFn(col, ev.target.value);
  }
  render(){
    let { defVal, label, value_style, input_style  } = this.props;
    let _input = (
      <input value = { defVal } onChange = { this.onChangeHandler.bind(this)}/>
    )
    return(
      <Row>
        <Col md = '2'><label>{label}</label></Col>
        <Col md = '8'>
          <div style = { value_style }>{ defVal }</div>
        </Col>
        <Col md = '8'>
          <div style = { input_style }>{ _input }</div>
        </Col>
      </Row>
    )
  }
}



class CustomInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      input_value : ''
    }
  }
  onKeyPressFn(ev){
    this.props.onKeyPressFn(ev);
    this.setState({ input_value : ev.target.value });
  }
  render(){
    let { input_value } = this.state;
    return (
      <div className = { 'input-field' + ( input_value == '' ? '' : ' have-value ' ) }>
        <input ref = 'search' type = 'text' onKeyPress = { this.onKeyPressFn.bind(this) } />
        <span className = 'bar'></span>
        <label>Search</label>
      </div>
    )
  }
}