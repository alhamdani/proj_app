import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

@inject( 'headerDetails' ) @observer
export default class TableInputSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      'options' : [],
      'value' : '0',
      'label' : ''
    }
  }
  componentDidMount() {
    let { _active_tabs } = this.props.headerDetails;
    let { Name, Value } = this.props;
    let { onOptions } = _active_tabs;
    if( onOptions ){
      if( onOptions[Name] ){
        let options = onOptions[ Name ].options, label = '';
        for( let x = 0; x < options.length; x++ ){
          let item = options[x];
          if( item.value == Value ){
            label = item.label;
          }
        }
        
        this.setState( { 'options' : options, 'value' : Value, 'label' : label } );
      }
    }
    
  }
  updateSelectInput( row_idx, col, ev ){
    let idx = ev.target.selectedIndex;
    let label = ev.target[idx].text;
    let value = ev.target.value;
    this.setState( { 'value' : value, 'label' : label } );
    this.props.headerDetails.updateInputObjValue( value, row_idx, col );
    this.props.headerDetails.addIdxOnEdited( row_idx );
  }
  constructOptions(){
    let { options, value } = this.state;
    let { RowIdx, Name } = this.props;
    let _arr = [];
    _arr.push(
      <option key = 'no-selected' value = '0' disabled> Please select </option>
    )
    options.forEach((_item,_idx)=>{
      _arr.push( <option key = { _idx } value = { _item.value }>{ _item.label }</option> );
    })
    return (
      <select value = { value }
        onChange = { this.updateSelectInput.bind(this, RowIdx, Name ) }>
        { _arr }
      </select>
    )
  }
  render(){
    let { isForAdding } = this.props;
    let { editingOnDetails } = this.props.headerDetails;
    let { label } = this.state;
    let content;

    if( isForAdding || editingOnDetails ){
      content = this.constructOptions();
    }else{
      content = ( <span> {label} </span> )
    }
    return(
      <div>
        { content }
      </div>
    )
  }

}