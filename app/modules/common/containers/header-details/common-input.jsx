import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

@inject( 'headerDetails' ) @observer
export default class CommonInput extends React.Component{
  constructor(props){
    super(props);
    this.state = { 'value' : '' }
  }
  componentDidMount() {
    let { ColName, value } = this.props;
    this.setState({ value : value });
  }
  onChangeInput(ev){
    this.setState({value : ev.target.value});
  }
  updateValue( value ){
    let {  ColName, RowIdx } = this.props;
    this.props.headerDetails.updateInputValue( value, RowIdx, ColName );
    this.props.headerDetails.addIdxOnEdited( RowIdx );
  }
  updateRealValue( ev ){
    let value = ev.target.value;
    if( ev.type == 'blur' ){
      this.updateValue( value );
    }else if( ev.type == 'keypress' ){
      if( ev.which == 13 ){
        this.updateValue( value );
      }
    }
  }
  render(){
    let { editingOnDetails } = this.props.headerDetails;
    let { value } = this.state, content = '';
    let { Type, ColName, isForAdding } = this.props;
    
    if( isForAdding || editingOnDetails ){
      let type = Type == 'input' ? 'text' : 'date';
      content = (
        <input 
          onBlur = { this.updateRealValue.bind( this ) }
            type = { type } 
              value = { value } 
                onChange = { this.onChangeInput.bind(this) }
                  onKeyPress = { this.updateRealValue.bind( this ) } />
      )
    }else{
      if( typeof value == 'string' ){
        if( Number( value ) ){
          let _item = value;
          value = _item.substring(0, _item.indexOf('.')+3)
        }
      }
      content = ( <span>{ value }</span> );
    }
    return(
      <div>
        { content }
      </div>
    )
  }

}