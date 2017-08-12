import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

// @inject( 'name of the sore' ) @observer
export default class FormViewIdx extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        
      </div>
    )
  }

}