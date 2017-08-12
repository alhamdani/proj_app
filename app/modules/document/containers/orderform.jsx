import React from 'react';
import Table from '../../common/containers/table';
import HeaderDetailsIdx from '../../common/containers/header-details-idx';

// import HeaderDetails from '../../common/containers/header-details-1';
export default class OrderHeaderForm extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
      let { params } = this.props;
      console.log( Object.keys( params ).length )
      console.log('+++++++')
      console.log(this.props.router.params)
  }
  render(){
        // <HeaderDetails/>
        // <HeaderDetailsIdx/>

    let header_inputs = [
      [
        { 'name' : 'doctype', 'label' : 'Document Type', 'size' : '5', 'type' : 'select', 'url' : 'documents/doctypeselect' },
      ],[
        { 'name' : 'party', 'label' : 'Customer/Supplier', 'size' : '5', 'type' : 'lookup', 'url' : 'lookup/party' },
      ],[
        { 'name' : 'location', 'label' : 'Location', 'size' : '5', 'type' : 'lookup', 'url' : 'lookup/location' },
      ],[
        { 'name' : 'docdate', 'label' : 'Document Date', 'size' : '5', 'type' : 'date' }
      ],[
        { 'name' : 'remarks', 'label' : 'Remarks', 'size' : '5', 'type' : 'textarea' }
      ]
    ];
    let tabs = [
      { 
        'label' : 'Document Details', 
        'name' : 'doc_details', 
        'url' : 'documents/tab1url',
        'savingUrl' : 'documents/savetab1url',
        'addUrl' : 'documents/savenewdatatab1url',
        'deleteUrl' : 'documents/deletedatatab1url',
        // input type = select
        // use when editing details
        'onOptions' : { 
          // the name of column : url to query to execute on page load
          'branch' : { 'url' : 'documents/sample_q1' },
        },
        'onLookups' : { 
          // the name of column : url to query on key press
          'product' : { 'url' : 'lookup/product' },
        },
        'relations':{
          // name of the column : the formula
          'total' : { 'formula' : '( unit_price * quantity )', 'decimal_place' : 2 }
        },
        cols : [ 
          { 'label' : 'Product', 'name' : 'product', 'type' : 'lookup', 'size' : 2  },
          { 'label' : 'Quantity', 'name' : 'quantity', 'type' : 'input', 'size' : 1 },
          { 'label' : 'Unit Price', 'name' : 'unit_price', 'type' : 'input', 'size' : 1 },
          { 'label' : 'Delivery Date', 'name' : 'delivery_date', 'type' : 'date', 'size' : 2 },
          { 'label' : 'Remarks', 'name' : 'comments', 'type' : 'input', 'size' : 2 },
          { 'label' : 'Total', 'name' : 'total', 'type' : 'text' },
          { 'label' : 'Branch', 'name' : 'branch', 'type' : 'select' },
          // { 'label' : 'Inventory Id', 'name' : 'inventory_id', 'type' : 'plain_text' },
          // { 'label' : 'Warehouse', 'name' : 'warehouse', 'type' : 'lookup', 'size' : 2 },
          // { 'label' : 'Line Description', 'name' : 'line_description', 'type' : 'input', 'size' : 2 },
          // { 'label' : 'UOM', 'name' : 'unit_of_measure', 'type' : 'input', 'size' : 2 },
          // { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship', 'type' : 'input' },
        ] },
      { 'label' : 'Commission', 'name' : 'comm_details', 'url' : 'documents/tab3url' },
      { 'label' : 'Financial Setting', 'name' : 'finan_details', 'url' : 'documents/tab4url' },
      { 'label' : 'Payment', 'name' : 'pay_details', 'url' : 'documents/tab5url' },
      { 'label' : 'Shipping', 'name' : 'ship_details', 'url' : 'documents/tab6url' },
    ]
    return(
      <div>
        <HeaderDetailsIdx 
          header_id = { (this.props.router.params.id) }
            getHeaderInfoUrl = 'documents/getheaderdetail' 
              saveHeaderUrl = 'documents/saveheadernewinfo'
                headerInputs = { header_inputs }
                  detail_tabs = { tabs }/>
      </div>
    )
  }
}