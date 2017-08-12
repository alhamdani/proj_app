import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

@inject( 'headerDetails' ) @observer
export default class LookupInput extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      'value' : '',
      'isOptionVisible' : false,
      'options' : []
    }
  }
  componentDidMount() {
    let { dataObj } = this.props;
    this.setState({ value : dataObj.label })
  }
  onChangeInput(ev){
    let value = ev.target.value;
    this.setState({ value : value });
    axios.get( this.props.Url, { params : { 'key' : value } } )
      .then( (rs) => {
        let data = rs.data.qs;
        this.setState({
          isOptionVisible : true,
          options : data.options
        })
      })
    this.props.headerDetails.addIdxOnEdited( this.props.RowIdx );
  }
  selectOnOptions( item ){
    let { RowIdx, ColName } = this.props;
    this.props.headerDetails.updateInputObjValue( item.value, RowIdx, ColName, item.label);
    this.setState( { value : item.label } );
  }
  onBlurInput(){
    this.setState({
      isOptionVisible : false,
      options : []
    })
  }
  render(){
    let { value, isOptionVisible, options } = this.state;
    let { editingOnDetails } = this.props.headerDetails;
    let isEditing = '', input = '';
    let { isForAdding } = this.props;
    if( isForAdding || editingOnDetails ){
      input = (
        <input type = 'text' 
          value = { value } onChange = { this.onChangeInput.bind(this) } 
            onBlur = { this.onBlurInput.bind(this) }/> );
    }else{
      input = (<span> { value }</span>);
    }
        
    let _opts_li = [];
    options.forEach((item, idx )=>{
      _opts_li.push(
        <li key = { idx } onMouseDown = { this.selectOnOptions.bind(this, item) }>{ item.label }</li>
      )
    });
    return(
      <div>
        { input }
        <div className = 'td-lookup-body' style = { ({ display : isOptionVisible ? 'block' : 'none' })}>
          <ul>
            { _opts_li }
          </ul>
        </div>
      </div>
    )
  }

}