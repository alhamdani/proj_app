import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

// @inject( 'name of the sore' ) @observer
export default class FormSelectInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value : '0'
    }
  }
  componentDidMount() {
    let { options } = this.props;
    this.setState({options:options});
  }
  render(){
    let { options } = this.props;
    let { value } = this.state;
    let _arr = [];
    _arr.push(<option value = '0' disabled>Please select</option>)
    options.forEach((item,idx)=>{
      _arr.push(
        <option value = { item.value } key = { idx }>{ item.label }</option>
      )
    })
    return(
      <div>
        <select value = { value } onChange = { this.updateSelected.bind(this) }>
          { _arr }
        </select>
      </div>
    )
  }

}