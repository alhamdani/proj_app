import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');


@inject( 'headerDetails' ) @observer
export default class TextOnly extends React.Component{
  constructor(props){
    super(props);
    this.state = { 'value' : '' }
  }
  componentDidMount() {
    

  }
  constructValue(){
    let { Relations, Row, Name } = this.props;
    
    let relations = Object.assign({}, Relations);
    let formula = relations.formula;
    let decimal_place = relations.decimal_place;
    
    let row = Object.assign({}, Row );
    for( let key in Row ){ // get the columns on the formula
      if( formula.indexOf(key) >= 0 ){
        if( Row[key] != '' ){
          formula = formula.replace(key, row[key]);
        }
      }
    }
    let final_text = ' - - ';
    try{
      let result = eval( formula );
      final_text = Number(Math.round(result+'e'+decimal_place)+'e-'+decimal_place);
    }catch(e){}
    return final_text;
  }
  render(){
    let content = this.constructValue();
    return(
      <div>{ content }</div>
    )
  }
}