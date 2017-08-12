import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';


import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';
import Input from 'muicss/lib/react/input';
import Button from 'muicss/lib/react/button';
import Panel from 'muicss/lib/react/panel';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import Form from 'muicss/lib/react/form';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export default class TablePagination extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isGoto : false
    }
  }
 
  componentDidMount(){ }
  nextList(){
    this.props.givenStore.nextList();
  }
  prevList(){
    this.props.givenStore.prevList()
  }
 
  goToList(ev){
    if( ev.which === 13 ){
      this.props.givenStore.goToList(ev.target.value);
      let { isGoto } = this.state;
      this.setState({
        isGoto : false
      })
    }
  }
  limitList( ev ){
    let { givenStore } = this.props;
    givenStore.changeLimit( ev.target.value );
  }
  showGoto(){
    let { isGoto } = this.state;
    this.setState({
      isGoto : true
    })
  }
  render(){
    // let { l_limit, l_current_page, l_page_from, l_page_to, l_max_page, l_counted_list, l_all_count } = this.state;
    let { all_count, limit, current_page, page_from, page_to, max_page } = this.props.givenStore;
    let { isGoto } = this.state;
    if( page_to != 0 ){
      page_from = parseInt(page_from) + 1; // zero index
    }

    // <input ref = 'goto' type = 'text'  onKeyPress = {this.goToList.bind(this) } defaultValue = { current_page } /> 
    return(
      <div className = "pagination-combo">
        <div className = 'limiter'>
          <label> Limit </label>
          <select onChange = { this.limitList.bind(this) } value = { limit } >
            <option value = '5'>5</option>
            <option value = '10'>10</option>
            <option value = '20'>20</option>
            <option value = '30'>30</option>
            <option value = '40'>40</option>
            <option value = '50'>50</option>
            <option value = 'all'>All</option>
          </select>
        </div>
        <div className ="go-to" >
          <span style = { ( { display : isGoto ? 'inline-block' : 'none' } ) } >
            <label>Go to </label>
            <input ref = 'goto' type = 'text' onKeyPress = {this.goToList.bind(this) } defaultValue = { current_page } /> 
          </span>
          <span 
            style = { ( { display : isGoto ? 'none' : 'inline-block' } ) } 
              className = "go-to-trigger" 
                onDoubleClick = { this.showGoto.bind(this) }>
            Page {current_page}
          </span>
          <span> to { max_page }</span>
        </div>
        <div className = 'page-map'>
          <button className="btn-prev" onClick = { this.prevList.bind(this) }>{('<')}</button>
          <label>
              { page_from } - { page_to } of { all_count }
          </label>
          <button className = "btn-next" onClick = { this.nextList.bind(this) }> {('>')} </button>
        </div>
      </div>
    )
  }
}