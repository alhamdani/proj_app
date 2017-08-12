import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

export default class HeaderDetails extends React.Component{
  render(){
    // these will be use for setting up the inputs on the headers
    
    let inputs = [
      [
        { 'name' : 'order_type', 'label' : 'Order type', 'size' : '3', 'type' : 'select' },
        { 'name' : 'order_number', 'label' : 'Order number', 'size' : '3', 'type' : 'input' },
        { 'name' : 'order_date', 'label' : 'Order date', 'size' : '3', 'type' : 'date' },
      ],[
        { 'name' : 'request_on', 'label' : 'Requested On', 'size' : '3', 'type' : 'lookup', 'url' : 'documents/requestonlookup' },
      ],[
        { 'name' : 'date_created', 'label' : 'Date created', 'size' : '4-5', 'type' : 'date' }
      ],[
        { 'name' : 'order_type2', 'label' : 'Order type 2', 'size' : '5', 'type' : 'textarea' },
      ]
    ];
    // every tabs should have urls
      // - these urls will be use to query details
    let tabs = [
      { 'label' : 'Document Details', 'name' : 'doc_details', 'url' : 'documents/tab1url', 'saveUrl' : 'documents/saveedited',
        // input type = select
        'onOptions' : {
          // the name of column
          'branch' : { 'url' : 'documents/sample_q1' },
          'branch2' : { 'url' : 'documents/sample_q3' },
          'branch3' : { 'url' : 'documents/sample_q4' },
        },
        'onLookups' : { 
          // the name of column
          'warehouse' : { 'url' : 'documents/sample_q2' },
          'warehouse2' : { 'url' : 'documents/sample_q5' },
          'warehouse3' : { 'url' : 'documents/sample_q6' },
        },
        'relations':{
          // name of the column : the formula
          'total' : { 'formula' : '( unit_price * quantity )', 'decimal_place' : 2 }
        },
        cols : [ 
          { 'label' : 'Branch', 'name' : 'branch', 'type' : 'select', 'size' : 2  },
          { 'label' : 'Quantity', 'name' : 'quantity', 'type' : 'input', 'size' : 2 },
          { 'label' : 'Unit Price', 'name' : 'unit_price', 'type' : 'input', 'size' : 2 },
          { 'label' : 'Total', 'name' : 'total', 'type' : 'text' },
          { 'label' : 'Inventory Id', 'name' : 'inventory_id', 'type' : 'input', 'size' : 2 },
          { 'label' : 'Warehouse', 'name' : 'warehouse', 'type' : 'lookup', 'size' : 2 },
          { 'label' : 'Line Description', 'name' : 'line_description', 'type' : 'input', 'size' : 2 },
          { 'label' : 'UOM', 'name' : 'unit_of_measure', 'type' : 'input', 'size' : 2 },
          { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship', 'type' : 'input' },
        ],
      },
      { 'label' : 'Tax details', 'name' : 'tax_details', 'url' : 'documents/tab2url',
        cols : [ 
              { 'label' : 'Branch', 'name' : 'branch' },
              { 'label' : 'Inventory Id', 'name' : 'inventory_id' },
              { 'label' : 'Warehouse', 'name' : 'warehouse' },
              { 'label' : 'Line Description', 'name' : 'line_description' },
              { 'label' : 'UOM', 'name' : 'unit_of_measure' },
              { 'label' : 'Quantity', 'name' : 'quantity' },
              { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship' },
              { 'label' : 'Unit Price', 'name' : 'unit_price' },
            ] },
      { 'label' : 'Commission', 'name' : 'comm_details', 'url' : 'documents/tab3url' },
      { 'label' : 'Financial Setting', 'name' : 'finan_details', 'url' : 'documents/tab4url' },
      { 'label' : 'Payment', 'name' : 'pay_details', 'url' : 'documents/tab5url' },
      { 'label' : 'Shipping', 'name' : 'ship_details', 'url' : 'documents/tab6url' },
    ]

    return (
      <div>

        <Header 
          headerId = '3'
            QUrl = 'documents/getheaderdetail'
              inputs = { inputs } />

        <Details tabs = { tabs }/>
      </div>
    )
  }
}



class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      'isLoaded' : false,
      'isEditing' : false,
      'inputs' : {}
    }
  }
  getHeader(){
    let { headerId,QUrl } = this.props;
    return axios.get( QUrl, { 'params' : { 'header_id' : headerId } } );
  }
  componentDidMount() {
    // this.constructInput();
    let { inputs } = this.props;
    this.getHeader()
      .then( (rs) => {
        let _obj = {};
        let data = rs.data.qs;
        inputs.forEach((item,idx)=>{
          item.forEach((_item, _idx) => {
            let _temp = { };
            if( _item.type == 'input' || _item.type == 'date' || _item.type == 'textarea' ){
              _temp.input_value = data[ _item.name ];
            }else if( _item.type == 'lookup' ){
              _temp.input_value = data[ _item.name ].label;
              _temp.value_id = data[ _item.name ].default_value;
              _temp.url = _item.url;
              _temp.options = [];
            }else if( _item.type == 'select' ){
              _temp.input_value = data[ _item.name ].default_value;
              _temp.options = data[ _item.name ].options;
            }
            _obj[ _item.name ] = _temp;
          });
        })
        // console.log(' - - - - - -- - - - - - - - - - - -- - - - - -- ')
        // console.log(inputs);
        // console.log(_obj)
        // console.log(' - - - - - -- - - - - - - - - - - -- - - - - -- ')
        this.setState({ 'isLoaded' : true, 'inputs' :_obj});
      })
    
  }
  onChangeInput( ev ){
    let { name, value } = ev.target;
    let _input = this.state.inputs;
    _input[name].input_value = value;
    this.setState(_input)
  }
  toggleInputEdit(name){
    let _input = this.state.inputs;
    _input[name].isEditing = !_input[name].isEditing;
    this.setState(_input)
  }
  highligthSameChars( _str, _val_str ){ // for suggestion
    let _str_low = _str.toLowerCase();
    let _val_low = _val_str.toLowerCase();
    let lbl = ''
    let starting_idx = _val_low.indexOf( _str_low );
    let new_lbl = '';
    let _arr = [];
    if( starting_idx >= 0 ){
      let upto = starting_idx + _str_low.length;
      let orig_val = _val_str.substring(starting_idx, upto);
      _val_str.split('').forEach((item, idx)=>{
        if( idx >= starting_idx && idx < upto ){
          _arr.push( <span className = 'found-char' key = {idx}>{item}</span> )
        }else{
          _arr.push( <span key = {idx}>{item}</span> )
        }
      })
    }else{
      return _val_str;
    }
    return _arr;
  }
  lookUpOnChange( ev ){
    let _input = this.state.inputs;
    let { name, value } = ev.target;
    _input[name].input_value = value;
    this.setState(_input)
    axios.get( _input[name].url, { 'params' : { 'key' : value } } )
      .then( (rs) => {
        let data = rs.data.qs;
        _input[name].options = data;
        this.setState(_input);
      })
  }
  lookUpClickChoice( name, option ){
    let _input = this.state.inputs;
    _input[name].input_value = option.label;
    _input[name].value_id = option.value;
    _input[name].options = [];
    this.setState(_input)
  }
  onBlurLookUp( name ){
    let _input = this.state.inputs;
     _input[name].options = [];
    this.setState(_input)
  }
  identifyAndConstruct( input, idx ){
    let { isEditing, inputs } = this.state;
    let val = inputs[input.name].input_value;
    if( input.type == 'input' || input.type == 'date'){
      let _type = input.type == 'input' ? 'text' : 'date';
      return(
        <div className = {('input sp'+input.size)} key = { idx }>
          <label>{input.label}</label>
          <input 
            onChange = { this.onChangeInput.bind(this) }
              type = { _type } 
                value = { val }
                  name = { input.name }
                    disabled = {(!isEditing)} />
        </div>
      )
    }else if( input.type == 'select' ){
      let _choices = [];
      inputs[ input.name ].options.forEach((item,idx)=>{
        _choices.push(
          <option key = { idx } value = { item.value }>{ item.label }</option>
        )
      })
      return(
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label> { input.label }</label>
          <select name = {input.name} value = { val } onChange = { this.onChangeInput.bind(this) } disabled = {(!isEditing)}>
            { _choices }
          </select>
        </div>
      )
    }else if( input.type == 'lookup' ){
      let _choices = [];
      inputs[ input.name ].options.forEach((item,idx)=>{
        let lbl = this.highligthSameChars( val, item.label );
        _choices.push(
          <li 
            key = { idx } 
              onMouseDown = { this.lookUpClickChoice.bind(this, input.name, item ) } >
            { lbl }
          </li>)
      })
      let _choicesContent = '';
      if( _choices.length ){
        _choicesContent = (
          <div className = 'lookup-body'>
            <ul>
              {_choices}
            </ul>
          </div>
        )
      }
      return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <input type = 'text'
            name = { input.name }
              onChange = { this.lookUpOnChange.bind(this) }
                value = { val }
                  disabled = {(!isEditing)} 
                    onBlur = { this.onBlurLookUp.bind( this, input.name ) }/>
          {_choicesContent}
        </div>
      )
    }else if( input.type == 'textarea' ){
      return(
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <textarea rows = '4' cols = '10' name = { input.name } value = { val } onChange = { this.onChangeInput.bind(this) } disabled = {(!isEditing)}/>
        </div>
      )
    }
  }
  constructInputs(){
    let { inputs } = this.props;
    // console.log(this.state.inputs)
    let block_el = [];
    inputs.forEach((item,idx)=>{
      let inline_el = [];
      item.forEach((_item, _idx)=>{
        inline_el.push( this.identifyAndConstruct( _item, _idx ) );
      })
      block_el.push(
        <div key = { idx } className = 'form-block'>
          { inline_el }
        </div>
      )
    })
    return block_el;
  }
  toggleEditing(){
    let { isEditing } = this.state;
    if( isEditing ){
      let _inputs = this.state.inputs;
      let { inputs } = this.props;
      let final_obj = {};
      inputs.forEach((item)=>{
        item.forEach((_item)=>{
          // console.log(_item);
          let _type = _item.type;
          if( _type == 'lookup' ){
            final_obj[ _item.name ] = _inputs[ _item.name ].value_id;
          }else if( _type == 'input' || _type == 'date' || _type == 'select' || _type == 'textarea' ){
            final_obj[ _item.name ] = _inputs[ _item.name ].input_value;
          }
        })
      });
      // console.log(final_obj)
    }
    this.setState({isEditing:!isEditing});
  }
  constructHeaderInfo(){
    let { isEditing } = this.state;
    return (
      <HeaderActions 
          isEditing = { isEditing }
            toggleEditing = { this.toggleEditing.bind(this) }/> );
  }
  render(){
    let { isLoaded } = this.state;
    let input_fields = '', header_info = '';
    if( isLoaded ){
      header_info = this.constructHeaderInfo();
      input_fields = this.constructInputs();
    }
    return(
      <div className = 'hdr-dtl-hdr'>
        { header_info }
        { input_fields }
      </div>
    )
  }
}
class HeaderActions extends React.Component{
  constructor(props){
    super(props);
  }
  saveEditIcon(){
    let { isEditing } = this.props;
    let name = 'pencil';
    if(isEditing){
      name = 'save';
    }
    return ( <FA name = { name } onClick = { this.props.toggleEditing.bind(this) }/> );
  }
  render(){
    let editSaveIcon = this.saveEditIcon();
    return(
      <div className = 'hdr-axn'>
        <ul className = 'axn'>
          <li>{editSaveIcon}</li>
          <li><FA name = 'trash'/></li>
          <li><FA name = 'refresh'/></li>
          <li ><FA name = 'edit'/></li>
        </ul>
      </div>
    )
  }
}

class Details extends React.Component{
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
  getData(url){
    return axios.get(url);
  }
  queryUrls( url ){
    return axios.get(url);
  }
  componentDidMount() {
    let { tabs } = this.props;
    
    // let _formula = tabs[0].relations.quantity_ship;
    // console.log( _formula.replace('quantity', '584.23') );

    let active_tab;
    if( tabs.length ){
      active_tab = tabs[0]; // reference on the tabs object
      let { onOptions, onLookups } = active_tab;
      let queries = [];
      // for( let key in onLookups ){
      //   let item = onLookups[key];
      //   queries.push( this.queryUrls( item.url ) );
      // }
      for( let key in onOptions ){
        let item = onOptions[key];
        queries.push( this.queryUrls(item.url ) );
      }
      axios.all( queries )
        .then( (...args)=>{
          let data = args[0];
          data.forEach((item)=>{
            let _data = item.data.qs;
            try{
              onOptions[_data.name].options = _data.options;
            }catch(e){}
            // try{
            //   onLookups[_data.name].options = _data.options;
            // }catch(e){}
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
                      'isOptionVisible' : false,
                      'label' : item[_item.name].label,
                      'default_value' : item[_item.name].default_value
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
    }
    
  }
  setAsActive(tab){
    // console.log(tab);
    if( tab.current_datas !== undefined ){
      let data = tab.current_datas;
      this.setState({active_tab : tab, 'data_on_active' : data});
    }else{
      axios.get( tab.url )
        .then( (rs) => {
          let data = rs.data.qs;
          let active_tab = tab;
          active_tab.current_datas = data;
          this.setState({active_tab : active_tab, 'data_on_active' : data});
        })
    }
   
  }
  
  constructTabs(){
    let { active_tab } = this.state;
    let { tabs } = this.props;
    let _arr = [];
    tabs.forEach((item,idx)=>{
      let cls = '';
      if( item.name == active_tab.name ){
        _arr.push( <li key = { idx } className = 'active' > {item.label} </li>);
      }else{
        _arr.push( <li key = { idx } onClick = { this.setAsActive.bind(this, item) } > {item.label} </li> )
      }
    })
    return _arr;
  }
  addNewData(){
    let { data_on_active, active_tab } = this.state;
    let _obj = {};
    active_tab['cols'].forEach((item)=>{
      if( item.type == 'lookup' || item.type == 'select' ){
        let _temp = { 'default_value' : '0' };
        if( item.type == 'lookup' ){
          _temp.label = '';
          _temp.isOptionVisible = false;
        }
        _obj[item.name] = _temp;
      }else{
        _obj[item.name] = '';
      }
    })
    _obj.toAdd = true;
    _obj.isSelected = false;
    data_on_active.push(_obj);
    this.setState({data_on_active:data_on_active});
  }
  removeData(){
    let { data_on_active } =  this.state;
    let _arr = [];
    data_on_active.forEach((item,idx)=>{
      if( !item.isSelected ){
        _arr.push(item);
      }
    });
    this.setState({data_on_active:_arr, selected_count : 0})
  }
  toggleIsSelected(item, ev){
    let { data_on_active, selected_count } = this.state;
    let _isSelected = ev.target.checked;
    if( item ){ // if row and not the added row on fly
      if( _isSelected ){
        selected_count = (selected_count + 1);
      }else{
        selected_count = (selected_count - 1);
      }
      let { isSelected } = item;
      item.isSelected = !isSelected;
      this.setState({data_on_active:data_on_active, selected_count : selected_count});
    }else{
      if( _isSelected ){
        selected_count = data_on_active.length;
      }else{
        selected_count = 0;
      }
      data_on_active.forEach((item,idx)=>{
        item.isSelected = _isSelected;
      });
      this.setState({data_on_active:data_on_active, selected_count : selected_count });
    }
    
  }
  updateInputValue(){
    let updated_data = this.state.data_on_active;
    // console.log(updated_data);
    this.setState({ data_on_active : updated_data })
  }
  toggleEditingOnRows(  ){
    // console.log()
    let { data_on_active } = this.state;
    data_on_active.forEach((item)=>{
      let { isEditing } = item;
      item.isEditing = !isEditing;
    })
    this.setState({ data_on_active : data_on_active })
  }
  toggleEditing(){
    let { isEditing, active_tab } = this.state;
    if( isEditing ){
      console.log()
      let _arr = [];
      this.state.data_on_active.forEach((item)=>{
        let _temp = {};
        for( let key in item ){
          if( typeof item[key] == 'object' ){
            _temp[ key ] = item[key].default_value;
          }else{
            _temp[ key ] = item[key];
          }
        }
        _arr.push( _temp );
      });
      axios.post(active_tab['saveUrl']+'/', { 'new_data' : _arr })
        .then((rs)=>{
          console.log(rs);
        });
    }else{
      console.log('editing')
    }
    this.setState({ isEditing : !isEditing }, ()=>{
      console.log('updating loading')
      this.setState({loading : true})
    });
  }
  render(){
    let { isLoaded, selected_count, isEditing } = this.state;
    let tab_list = '', tbl = '', saveEditIcon = '';
    if( isLoaded ){
      let { active_tab, data_on_active } = this.state;
      // console.log('- - - - active tabs - - - - ')
      // console.log(active_tab)
      // console.log('- - - - active tabs - - - - ')
      tab_list = this.constructTabs();
      tbl = ( 
        <DetailTable
          onLookups = { active_tab[ 'onLookups' ] }
            onOptions = { active_tab[ 'onOptions' ]}
              formulas = { active_tab['relations']}
                columns = { active_tab['cols'] } 
                  data_on_active = { data_on_active }
                    selected_count = { selected_count }
                      toggleIsSelected = { this.toggleIsSelected.bind(this) }
                        updateInputValue = { this.updateInputValue.bind(this) }
                          isEditing = { isEditing } /> );
    }
    if( isEditing ){
      saveEditIcon = 'save';
    }else{
      saveEditIcon = 'pencil';
    }
    return (
      <div className = 'hdr-dtl-dtl'>
        <div className = 'dtl-axn'>
          <ul className = 'axn-grp-1'>
            <li><FA name = 'plus' onClick = { this.addNewData.bind(this) }/></li>
            <li><FA name = 'trash' onClick = { this.removeData.bind(this) } /></li>
            <li><FA name = {saveEditIcon} onClick = { this.toggleEditing.bind(this) } /></li>
          </ul>
        </div>
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


class DetailTable extends React.Component{
  constructor(props){
    super(props);
  }
  
  constructHdr(){
    let { columns, data_on_active, selected_count, formulas } = this.props;
    let isAllSelected = false;
    if( data_on_active.length == selected_count ){
      isAllSelected = true;
    }
    
    if( columns !== undefined ){
      let hdr = [];
      let chxBox = '';
      if( data_on_active.length ){
        chxBox = ( <input type = 'checkbox' checked = { isAllSelected } onChange = { this.props.toggleIsSelected.bind(this, false) }/> )
      }
      hdr.push(
        <th key = 'chxbox'>
          { chxBox }
        </th>
      )
      columns.forEach((item, idx)=>{
        hdr.push(<th key = { idx }>{item.label}</th>)
      })
      return hdr;
    }else{
      console.log('no header define')
      return '';
    }
  }
  constructTds(row){
    let { columns, isEditing } = this.props;
    let tds = [];
    
    /*if( row.isEditing ){
      tds.push( this.constructInputs( row ) );
    }else{
      tds.push(
      <td key = 'chxbox'>
        <input type = 'checkbox' checked = { row.isSelected } onChange = { this.props.toggleIsSelected.bind(this, row) }/>
      </td>)
      columns.forEach((item,idx)=>{
        tds.push(
          <td key = { idx }>
            { row[ item.name ] }
          </td>)
      });
    }*/
    
    if( isEditing ){
      // console.log( 'is Editing');
      tds.push( this.constructInputs( row ) );
    }else{
      // console.log(' - - - start - - - ')
      tds.push(
        <td key = 'chxbox'>
          <input type = 'checkbox' checked = { row.isSelected } onChange = { this.props.toggleIsSelected.bind(this, row) }/>
        </td>)
      columns.forEach((item,idx)=>{
        if( item.type == 'lookup' || item.type == 'select' ){
        // console.log('lookup - - - >',row);
          tds.push(
            <td key = { idx }> { row[ item.name ].label }</td>);
        }else if( item.type == '' ){

        }else{
          tds.push(
            <td key = { idx }>
              { row[ item.name ] }
            </td>)
        }
      });
    }
      
    return tds;
  }
  onChangeInput( col, row, ev ){
    // console.log(ev.target.value);
    if( col.type == 'lookup' ){ // when lookups
      let val = ev.target.value;
      row[ col.name ].isOptionVisible = true;
      row[ col.name ].label = val;
      this.updateLookupOptions(col.name, val);
    }else if( col.type == 'select' ){
      let val = ev.target.value;
      row[ col.name ].default_value = val;
      this.props.updateInputValue();
    }else{
      row[col.name] = ev.target.value;
      this.props.updateInputValue();
    }
  }
  updateLookupOptions( name, val ){
    // console.log(name);
    let { onLookups } = this.props;
    let { url } = onLookups[name];
    
    axios.get(url, { params : { 'keyCode' : val } } )
      .then((rs)=>{
        let { options } = rs.data.qs;
        onLookups[name].options = options;
        this.props.updateInputValue();
      })
    
  }
  blurOnLookup( col, row ){
    row[ col.name ].isOptionVisible = false;
    this.props.updateInputValue();
  }
  selectOnLookup( col, row, new_val ){
    row[ col.name ].label = new_val.label;
    row[ col.name ].default_value = new_val.value;

    // row[ col.name ] = { 'label' : new_val.label, 'value' : new_val.value };
    this.props.updateInputValue();
  }
  constructInputs( row ){
    let { data_on_active } = this.props;
    let { columns } = this.props;
    let tds = [];
    // console.log(row)
    tds.push(
      <td key = 'chxbox'>
        <input type = 'checkbox' onChange = { this.props.toggleIsSelected.bind(this, row) } checked = { row.isSelected } />
      </td>)
    columns.forEach((item,idx)=>{
      let size = 25;
      let _input = '';
      if( item.size !== undefined ){
        size = item.size * 10;
      }
      
      if( item.type == 'input' ){
        // console.log(item.type, item.name);
        tds.push(
          <td key = { idx }>
            <input type = 'text' size = {size} value = { row[ item.name ]} onChange = { this.onChangeInput.bind(this, item, row ) }/>
          </td>)
      }else if( item.type == 'text' ){
        // console.log(row);
        let formula = '';
        try{
          formula = this.props.formulas[item.name].formula;
          for( let key in row ){ // get the columns on the formula
            if( formula.indexOf(key) >= 0 ){
              if( row[key] != '' ){
                formula = formula.replace(key, row[key]);
              }
            }
          }
        }catch(e){
          console.log('there is a problem on formula');
        }
        
        try{
          let result = eval(formula);
          let decimals = this.props.formulas[item.name].decimal_place
          let roundedUpValue = Number(Math.round(result+'e'+decimals)+'e-'+decimals);
          tds.push(
            <td key = { idx }>{roundedUpValue}</td>
          )
          row[item.name] = roundedUpValue;
        }catch(e){
          tds.push(
            <td key = { idx }> - - </td>
          ) }
      }else if( item.type == 'select' ){
        console.log('select', )
        let { onOptions } = this.props;
        let data = row[ item.name ];
        // console.log()
        let _choices = [];
        try{
          onOptions[item.name].options.forEach((_item,_idx)=>{
            _choices.push(
              <option key = { _idx } value = { _item.value }>{ _item.label }</option>
            )
          })
        }catch(e){}
        // console.log(row[ item.name ])
        tds.push( 
          <td key = { idx }>
            <div>
              <select value = { data.default_value } onChange = { this.onChangeInput.bind(this, item, row ) }>
                { _choices }
              </select>
            </div>
          </td> )
      }else if( item.type == 'lookup' ){
        // console.log(item.type);
        let { onLookups } = this.props;
        let _choices = [];
        try{
          let _row = row[item.name];
          onLookups[item.name].options.forEach((_item,_idx)=>{
            if( _item.value == _row.value ){
              _choices.push(
                <li key = { _idx } className = 'active' onMouseDown = { this.selectOnLookup.bind( this, item, row ) }>
                  { _item.label }
                </li>
              )
            }else{
              _choices.push(
                <li key = { _idx } 
                  onMouseDown = { this.selectOnLookup.bind( this, item, row, _item ) }>
                    { _item.label }
                </li>
              )
            }
          })
        }catch(e){}
        let data = row[ item.name ];
        tds.push(
          <td key = { idx } className = 'wt-lookup'>
            <input type = 'text' 
              value = { data['label'] } 
                onChange = { this.onChangeInput.bind(this, item, row ) } 
                  onBlur = { this.blurOnLookup.bind(this, item, row )}/>
            <div className = 'td-lookup-body' style = { ({ display : data['isOptionVisible'] ? 'block' : 'none' })}>
              <ul>
                { _choices }
              </ul>
            </div>
          </td>
        )
      }
    });
    return tds;
  }
  constructRows(){
    // console.log( this.props.data_on_active );
    let { data_on_active } = this.props;
    if( data_on_active !== undefined ){
      let _rows = [];
      data_on_active.forEach((item,idx)=>{
        // console.log(item);
        let tds = '';
        if( item.toAdd == undefined ){
           tds = this.constructTds( item );
        }else{
          tds = this.constructInputs( item );
        }
        _rows.push(
          <tr key = { idx }>
            { tds }
          </tr>)
      })
      return _rows;
    }else{
      console.log('data_on_active is not define')
    }
    
  }
  render(){
    
    let hdr = this.constructHdr();
    let rows = this.constructRows();
    return(
      <div className = 'dtl-tbl'>
        <table>
          <thead>
            <tr>{ hdr }</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <br/>
        <br/>
        <br/>
        <br/>
        <div>
          <button>Prev</button>
          <button>Next</button>
        </div>
      </div>
    )
  }
}