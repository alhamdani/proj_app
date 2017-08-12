import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export default class AddEditForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoaded : false,
      isEditing : false
    }
  }
  queryUrls( url ){
    return axios.get( url );
  }
  componentDidMount() {
    let { QUrlInfo } = this.props;
    let { updateId } = this.props;
    if( updateId != undefined && updateId != '' ){
      axios.get(QUrlInfo, { params : { 'id' : updateId } } )
        .then((rs)=>{
          console.log(rs);
          let data = rs.data.qs;
          let { inputs } = this.props;
          let _obj = {};
          inputs.forEach((item)=>{
            item.forEach((_item)=>{
              // console.log(data[ _item.name ], _item);
              if( _item.type == 'select' ){
                _obj[_item.name ] = data[ _item.name ].default_value;
                _item.options = data[ _item.name ].options;
              }else if( _item.type == 'input' || _item.type == 'textarea' || _item.type == 'date' ){
                _obj[_item.name ] = data[ _item.name ];
              }else if( _item.type == 'lookup' ){
                // console.log('lookup value', data[ _item.name ]['label']);
                // _obj[ _item.name ] = { 'input_value' : data[ _item.name ].label, 'selected_idx' : 0, 'value_id' : 0, options : [], 'url' : _item.url };
                _obj[ _item.name ] = { 'input_value' : data[ _item.name ].label, 'selected_idx' : 0, 'value_id' : data[ _item.name ].default_value, options : [], 'url' : _item.url };
              }
            })
          })
          _obj.isLoaded = true;
          this.setState(_obj);
        })
    }else{ // for adding
      // console.log('for adding')
      let _obj = {};
      let allSelectUrl = {}, selectObj = {};
      let { inputs } = this.props;
      inputs.forEach((item)=>{
        item.forEach((_item)=>{
          if( _item.type == 'input' || _item.type == 'textarea' || _item.type == 'date'){
            _obj[_item.name] = '';
          }else if( _item.type == 'select' ){
            allSelectUrl[ _item.name ] = _item.url;
            _obj[_item.name] = '0';
            _item.options = [];
            selectObj[ _item.name ] = _item;
          }else if( _item.type == 'lookup' ){
            _obj[ _item.name ] = { 'input_value' : '', 'value_id' : 0, 'selected_idx' : 0, options : [], 'url' : _item.url };
          }else if( _item.type == 'multiselect' ){
           
          }
        })
      })
      // console.log('obj value', _obj);
      let queryList = [];
      for( let key in allSelectUrl ){
        queryList.push( this.queryUrls( allSelectUrl[key] ) );
      }
      if( queryList.length > 0 ){
         axios.all( queryList )
          .then(axios.spread(function(){
            for( let i = 0; i < arguments.length; i++ ){
              let arg = arguments[i].data.qs;
              selectObj[ arg.name ].options = arg.options;
            }
            _obj.isLoaded = true;
            this.setState(_obj);
          }.bind(this)) )
      }else{
        _obj.isLoaded = true;
        this.setState(_obj);
      }
    }
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
  identifyInputTypeContruct( input ){
    let stateVals = this.state;
    let { isEditing } = this.state;
    if( input.type == 'select' ){
      let choices = [];
      choices.push(
        <option key = 'no_selected' value = '0' disabled> Select </option>
      )
      input.options.forEach((item,idx)=>{
        choices.push(
          <option value = { item.value } key = { idx }>{ item.label}</option>
        )
      });
      
      return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label> { input.label }</label>
          <select name = {input.name} value = { stateVals[ input.name ] } onChange = { this.handleInputChange.bind(this) } disabled = {(!isEditing)}>
            { choices }
          </select>
        </div>
      )
    }else if( input.type == 'input' ){
      return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <input type = 'text' name = { input.name } value = { stateVals[ input.name ] } onChange = { this.handleInputChange.bind(this) }  disabled = {(!isEditing)} />
        </div>
      )
    }else if( input.type == 'lookup' ){
      let _val = stateVals[ input.name ];
      let _choices = [];
      
      _val.options.forEach((item,idx)=>{
        let cls = '';
        if( _val.selected_idx == idx ){
          cls = 'selected'
        }
        let lbl = this.highligthSameChars( _val.input_value, item.label );
        _choices.push(
          <li 
            key = { idx } 
              onClick = { this.lookUpClickChoice.bind(this, input.name, item)}
                className = {cls}>
            {lbl}
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
            onChange = { this.lookUpOnChange.bind(this, input.name) }
              value = {_val.input_value} 
                onKeyDown = { this.onChangeLookup.bind(this, input.name) }  disabled = {(!isEditing)} />
          {_choicesContent}
        </div>
      )
    }else if( input.type == 'multiselect' ){
      // to be created
    }else if( input.type == 'textarea' ){
      return(
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <textarea rows = '4' cols = '10' name = { input.name } value = { stateVals[ input.name ] } onChange = { this.handleInputChange.bind(this) }  disabled = {(!isEditing)}/>
        </div>
      )
    }else if( input.type == 'date' ){
       return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <input type = 'date' name = { input.name } value = { stateVals[ input.name ] } onChange = { this.handleInputChange.bind(this) }  disabled = {(!isEditing)}/>
        </div>
      )
    }
  
  }
  lookUpOnChange(name,ev){
    let _obj = {};
    _obj[name] = this.state[name];
    let val = ev.target.value;
    // console.log(_obj[name].url);
    axios.get(_obj[name].url+'/', { 'params' : { 'key' : val }})
      .then((rs)=>{
        let data = rs.data.qs;
        _obj[name].options = data.options;
        this.setState( _obj );
      })
    _obj[name].input_value = val;
    this.setState( _obj );
  }
  lookUpClickChoice( name, option ){
    let _obj = {};
    _obj[name] = this.state[name];
    _obj[name].options = [];
    _obj[name].input_value = option.label;
    _obj[name].value_id = option.value;
    this.setState(_obj);
  }
  onChangeLookup(name, ev){
    let _obj = {};
    _obj[name] = this.state[name];
    if( ev.which == 13 ){ // when enter was pressed
      let idx = _obj[name].selected_idx;
      let option =  _obj[name].options[ idx ];
      _obj[name].options = [];
      _obj[name].input_value = option.label;
      _obj[name].value_id = option.value;
      _obj[name].selected_idx = 0;
      this.setState( _obj );
      ev.preventDefault(); // prevent submitting form information
    }else if( ev.keyCode == 27 ){ // when escape was pressed
      _obj[name].input_value =  '';
      _obj[name].value_id = '';
      _obj[name].options = [];
      _obj[name].selected_idx = 0;
      this.setState( _obj );
    }else if( ev.keyCode == 40 ){ // when down arrow was pressed
      let idx = _obj[name].selected_idx ;
      let len = (_obj[name].options.length - 1);
      if( idx < len ){
        _obj[name].selected_idx = (parseInt(idx) + 1)
        this.setState( _obj );
      }
      // _obj[name]
    }else if( ev.keyCode == 38 ){ // when up arrow was pressed
      let idx = _obj[name].selected_idx ;
      if( _obj[name].options.length && idx > 0 ){
        _obj[name].selected_idx = (parseInt(idx) - 1)
      }
      this.setState( _obj );
    }
    
  }
  onBlurInput(name){
    let _obj = {};
    _obj[name] = this.state[name];
    _obj[name].options = [];
    this.setState(_obj);
  }
  constructInput(){
    let { inputs } = this.props;
    let block_input = [];
    inputs.forEach((item,idx)=>{
      let inline_input = [];
      item.forEach((_item)=>{
        inline_input.push(this.identifyInputTypeContruct(_item))
      })
      block_input.push(
        <div key = { idx } className = 'form-block'>
          { inline_input }
        </div>
      );
    })
    return block_input;
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(ev) {
    ev.preventDefault();
    let { saveUrl } = this.props;
    let newValues = this.state;
    let { updateId } = this.props;
    if( updateId !== undefined && updateId !== ''){
      newValues.updateId = updateId;
    }
    delete newValues.isLoaded;
    for( let key in newValues ){
      if( typeof newValues[key] == 'object' ){
        newValues[key] = newValues[key].value_id;
      }
    }
    // console.log(newValues);
    axios.post(saveUrl, { 'data' : newValues } )
      .then((rs)=>{
        // console.log(rs);
        if( rs.data.message == 'success' ){
          this.props.router.goBack();
        }
      })
  }
  toggleEditing( ev ){
    ev.preventDefault();
    let { isEditing } = this.state;
    this.setState({isEditing:!isEditing})
  }
  render(){
    let { isLoaded, isEditing } = this.state;
    let saveEditBtn = ( <button type = 'button' onClick = { this.toggleEditing.bind(this) }>Edit</button> );
    if( isEditing ){
      saveEditBtn = ( <button type = 'submit'>Save</button> );
    }
    let inputs = '', form = '';
    if( isLoaded ){
      inputs = this.constructInput();
      form = (
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <div className = 'content-form'>
            { inputs }
          </div>
          <button type = 'button' onClick = { this.props.router.goBack.bind(this) }>Cancel</button>
          { saveEditBtn }
        </form>
      )
    }
    return(
      <div>
        { form }
      </div>
    )
  }
}

/*
 // componentWillMount(){
  //   let obj = {};
  //   let { inputs } = this.props;
  //   inputs.forEach((item)=>{
  //     item.forEach((_item)=>{
  //       if( _item.type == 'input' ){
  //         let val = _item.value ? _item.value : '';
  //         obj[ _item.name ] = {value : val};
  //       }else if( _item.type == 'select' ){
  //         let val = _item.value ? _item.value : '0';
  //         obj[ _item.name ] = {value : val, options : []};
  //       }
  //     })
  //   });
  //   this.setState(obj);
  // }

*/