import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

import AddEditForm from '../../common/containers/add-edit-form';

export default class UpdateAccountingPeriod extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      isAdding : true,
      data : {},
      formHeaderTitle : '',
      objId : '',
      inputs : [
        [
          {
            'type' : 'input',
            'name' : 'code',
            'label' : 'Code',
            'size' : 2
          }
        ],
        [
          {
            'type' : 'input',
            'name' : 'description',
            'label' : 'Description',
            'size' : 2
          }
        ],
        [
          {
            'type' : 'select',
            'name' : 'period_type',
            'label' : 'Type',
            'size' : 2,
            'url' : 'accounting/lookupperiodtype'
          }
        ],
        [
          {
            'type' : 'date',
            'name' : 'from_date',
            'label' : 'From',
            'size' : 2
          }
        ],
        [
          {
            'type' : 'date',
            'name' : 'thru_date',
            'label' : 'Thru',
            'size' : 2,
            'format':'yyyy-mm-dd'
          }
        ]
      ],
      isLoaded : false
    }
  }
  setUpValuesOnInput( data ){
    let { inputs } = this.state;
    inputs.forEach((item)=>{
      item.forEach((_item)=>{
        _item.value = data[_item.name];
      })
    })
    return inputs;
  }
  componentDidMount(){
    let { params } = this.props;
    if( Object.keys( params ).length ){
      let obj_id = params.id;
      this.setState({ isAdding : false, isLoaded : true, objId : obj_id, formHeaderTitle : 'Edit Accounting Period' });
    }else{
      this.setState( { formHeaderTitle : 'Add', isLoaded : true } );
    }
  }
  constructFormInput(){
    let { inputs, objId } = this.state;
    return (
      <AddEditForm
        updateId = { objId }
          inputs = { inputs } 
            router = { this.props.router }
              saveUrl = 'accounting/saveacctgperiod/'
                QUrlInfo = 'accounting/getacctgperiod/' />
    );
  }
  render(){
    let { formHeaderTitle } = this.state;
    let { isLoaded } = this.state;
    let formInputs = '';
    if( isLoaded ){
      formInputs = this.constructFormInput();
    }
    return(
      <div>
        { formHeaderTitle }
        { formInputs }
      </div>
    )
  }
}