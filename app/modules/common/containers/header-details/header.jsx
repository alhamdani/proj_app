import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

import HeaderActions from './header-action';

const FA = require('react-fontawesome');

@inject( 'headerDetails' ) @observer
export default class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      'isLoaded' : false,
      'isEditing' : false,
      'inputs' : {}
    }
  }
  getHeader(){
    let { headerId, getHeaderInfoUrl } = this.props;
    return axios.get( getHeaderInfoUrl, { 'params' : { 'header_id' : headerId } } );
  }
  querySelectUrl( url ){
    return axios.get( url );
  }
  componentDidMount() {
    // this.constructInput();
    let { inputs } = this.props;
    // console.log(this.props.headerId, 'headerId');
    if( this.props.headerId ){
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
          // console.log(_obj);
          this.setState({ 'isLoaded' : true, 'inputs' :_obj});
        })
    }else{
      let optUrl = [];
      let _obj = {};
      inputs.forEach((item,idx)=>{
        item.forEach((_item, _idx) => {
          let _temp = { };
          if( _item.type == 'input' || _item.type == 'date' || _item.type == 'textarea' ){
            _temp.input_value = '';
          }else if( _item.type == 'lookup' ){
            _temp.input_value = ''
            _temp.value_id = 0;
            _temp.url = _item.url;
            _temp.options = [];
          }else if( _item.type == 'select' ){
            _temp.input_value = 0;
            _temp.options = [];
            optUrl.push( this.querySelectUrl(_item.url) );
          }
          _obj[ _item.name ] = _temp;
        });
      })
      axios.all( optUrl )
        .then( ( ...args ) => {
          let data = args[0];
          data.forEach( (item) => {
            let _data = item.data.qs;
            _obj[ _data.name ].options = _data.options;
          })
          this.setState({ 'isLoaded' : true, 'inputs' :_obj, 'isEditing' : true });
        })
    }
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
        _input[name].options = data.options;
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
      _choices.push(
        <option key = 'no_selected' value = '0' disabled> Select </option>
      )
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
      let { saveHeaderUrl, headerId } = this.props;
      final_obj.id = headerId;
      axios.post(saveHeaderUrl+'/', { 'new_data' : final_obj } )
        .then((rs)=>{
          console.log(rs);
        })
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
        <div className = 'hdr-ipts-inf'>
          <div className = 'ipts'>
            { input_fields }
          </div>
          <div className = 'inf'>
            
          </div>
        </div>
      </div>
    )
  }
}