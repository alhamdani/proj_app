import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
// import axios from "axios";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";
const FA = require('react-fontawesome');
@inject( 'headerDetails' ) @observer
export default class TableCheckbox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isSelected : false
    }
  }
  
  toggleIsSelected(){
    let { isSelected } = this.state;
    let { RowIdx } = this.props;
    this.setState({ isSelected : !isSelected });
    this.props.headerDetails.toggleIsSelected( RowIdx );
  }

  render(){
    let { isSelected } = this.state;
    
    return(
      <div>
        <input type = 'checkbox' checked = { isSelected } onChange = { this.toggleIsSelected.bind(this) }/>
      </div>
    )
  }

}