import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');
import Header from './header-details/header';
import Details from './header-details/details';


@inject( 'headerDetails' ) @observer
export default class HeaderDetailsIdx extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount() {
    let { header_id, detail_tabs, headerInputs } = this.props
    this.props.headerDetails.setVariables( detail_tabs, headerInputs, header_id );
  }
  render(){
    // these will be use for setting up the inputs on the headers
    let inputs = this.props.headerDetails._inputs;
    let tabs = this.props.headerDetails._tabs;
    let isVariableSetUp = this.props.headerDetails.isVariableSetUp;
    // every tabs should have urls
      // - these urls will be use to query details
    let { header_id, getHeaderInfoUrl, saveHeaderUrl, headerInputs  } = this.props;
    // QUrl = url to get the header info
    let content = '';
    if( isVariableSetUp ){
      content = (
        <div>
          <Header 
            headerId = { header_id }
              getHeaderInfoUrl = { getHeaderInfoUrl }
                saveHeaderUrl = { saveHeaderUrl }
                  inputs = { headerInputs } />
          <Details headerId = { header_id } />
        </div>
      )
    }
    return (
      <div>
        { content }
      </div>
    )
  }
}


    /*
      let inputs = [
        [
          { 'name' : 'order_type', 'label' : 'Order type', 'size' : '3', 'type' : 'select' },
          { 'name' : 'order_number', 'label' : 'Order number', 'size' : '3', 'type' : 'input' },
          { 'name' : 'order_date', 'label' : 'Order date', 'size' : '3', 'type' : 'date' },
        ],[
          { 'name' : 'request_on', 'label' : 'Requested On', 'size' : '3', 'type' : 'lookup', 'url' : 'documents/requestonlookup' },
        ],[
          { 'name' : 'date_created', 'label' : 'Date created', 'size' : '4-5', 'type' : 'date' }
        ],[
          { 'name' : 'order_type2', 'label' : 'Order type 2', 'size' : '5', 'type' : 'textarea' },
        ]
      ];
    */
    /*
      let tabs = [
        { 'label' : 'Document Details', 'name' : 'doc_details', 'url' : 'documents/tab1url',
          // input type = select
          'onOptions' : {
            // the name of column
            'branch' : { 'url' : 'documents/sample_q1' },
            'branch2' : { 'url' : 'documents/sample_q3' },
            'branch3' : { 'url' : 'documents/sample_q4' },
          },
          'onLookups' : { 
            // the name of column
            'warehouse' : { 'url' : 'documents/sample_q2' },
            'warehouse2' : { 'url' : 'documents/sample_q5' },
            'warehouse3' : { 'url' : 'documents/sample_q6' },
          },
          'relations':{
            // name of the column : the formula
            'total' : { 'formula' : '( unit_price * quantity )', 'decimal_place' : 2 }
          },
          cols : [ 
            { 'label' : 'Branch', 'name' : 'branch', 'type' : 'select', 'size' : 2  },
            { 'label' : 'Quantity', 'name' : 'quantity', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Unit Price', 'name' : 'unit_price', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Total', 'name' : 'total', 'type' : 'text' },
            { 'label' : 'Inventory Id', 'name' : 'inventory_id', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Warehouse', 'name' : 'warehouse', 'type' : 'lookup', 'size' : 2 },
            { 'label' : 'Line Description', 'name' : 'line_description', 'type' : 'input', 'size' : 2 },
            { 'label' : 'UOM', 'name' : 'unit_of_measure', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship', 'type' : 'input' },
          ] },
        { 'label' : 'Tax details', 'name' : 'tax_details', 'url' : 'documents/tab2url',
          cols : [ 
                { 'label' : 'Branch', 'name' : 'branch' },
                { 'label' : 'Inventory Id', 'name' : 'inventory_id' },
                { 'label' : 'Warehouse', 'name' : 'warehouse' },
                { 'label' : 'Line Description', 'name' : 'line_description' },
                { 'label' : 'UOM', 'name' : 'unit_of_measure' },
                { 'label' : 'Quantity', 'name' : 'quantity' },
                { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship' },
                { 'label' : 'Unit Price', 'name' : 'unit_price' },
              ] },
        { 'label' : 'Commission', 'name' : 'comm_details', 'url' : 'documents/tab3url' },
        { 'label' : 'Financial Setting', 'name' : 'finan_details', 'url' : 'documents/tab4url' },
        { 'label' : 'Payment', 'name' : 'pay_details', 'url' : 'documents/tab5url' },
        { 'label' : 'Shipping', 'name' : 'ship_details', 'url' : 'documents/tab6url' },
      ]
    */









/*
let { inputs} = this.state;
    let inputIsEditing = inputs['test_name'].isEditing;
    let txtInputIcon = '';
    if( inputIsEditing ){
      txtInputIcon  = ( <FA name = 'save' className = 'edt-icon' onClick = { this.toggleInputEdit.bind(this, 'test_name') }/> )
    }else{
      txtInputIcon = ( <FA name = 'pencil' className = 'edt-icon' onClick = { this.toggleInputEdit.bind(this, 'test_name') }/> )
    }
    return(
      <div className = 'hdr-dtl-hdr'>
        <div className = 'hdr-hd'>
          <h4>Order #92837</h4>
        </div>
        <div className = 'content-form'>
          <div className = 'form-block'>
            <div className = 'input sp2-5 wt-icon'>
              <label>Test</label>
              <input type = 'text' name = 'test_name' value = { inputs['test_name'].value } onChange = { this.onChangeInput.bind(this) } disabled = {(!inputIsEditing) }/>
              {txtInputIcon}
            </div>
            <div className = 'input sp7'>
              <label>Test</label>
              <input type = 'text'/>
            </div>
          </div>
        </div>
      </div>
*/