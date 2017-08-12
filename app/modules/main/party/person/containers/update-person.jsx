import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

import AddEditForm from '../../../../common/containers/add-edit-form';
const FA = require('react-fontawesome');
export default class UpdatePerson extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      isAdding : true,
      data : {},
      formHeaderTitle : '',
      partyId : '',
      inputs : [
        [
          {
            'type' : 'input',
            'name' : 'first_name',
            'label' : 'First name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'middle_name',
            'label' : 'Middle name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'last_name',
            'label' : 'Last name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'suffix',
            'label' : 'Suffix',
            'size' : 2
          }
        ],
        [
          {
            'type' : 'date',
            'name' : 'datetest',
            'label' : 'Date',
            'size' : 7
          }
          
        ],[
          {
            'type' : 'input',
            'name' : 'qweq2',
            'label' : 'sad2f',
            'size' : 5
          },
          {
            'type' : 'input',
            'name' : 'qweq3',
            'label' : 'sadf3',
            'size' : '4-5'
          }
        ],[
          {
            'type' : 'textarea',
            'name' : 'textarea_test',
            'label' : 'Text area',
            'size' : 5
          }

        ],
        [ {
            'type' : 'select',
            'name' : 'group',
            'label' : 'Group',
            'size' : 2
          },{
            'type' : 'lookup',
            'name' : 'group2',
            'label' : 'Group2',
            'url' : 'getallgroups',
            'size' : 2
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
      let party_id = params.id;
      this.setState({ isAdding : false, isLoaded : true, partyId : party_id, formHeaderTitle : 'Edit Person' });
    }else{
      this.setState( { formHeaderTitle : 'Add Person', isLoaded : true } );
    }
  }
  constructFormInput(){
    let { inputs, partyId } = this.state;
    return (
      <AddEditForm
        updateId = { partyId }
          inputs = { inputs } 
            router = { this.props.router }
              saveUrl = 'savenewperson/'
                QUrlInfo = 'getpersoninfo/' />
    );
  }
  render(){
    let party_id = this.props.params.id;
    let { formHeaderTitle } = this.state;
    let { isLoaded } = this.state;
    let formInputs = '';
    if( isLoaded ){
      formInputs = this.constructFormInput();
    }
    return(
      <div>
        <PersonGroup party_id = { party_id }/>
        { formHeaderTitle }
        { formInputs }
      </div>
    )
  }
}
class PersonGroup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      all_group : [],
      person_group_ids : [],
      choices : [],
      isLoaded : false,
      choicesIsVisible : false,
      inputVal : '',
      isTouched : false
    }
  }
  allGroupAndPersonGroup(){
    let { party_id } = this.props;
    return axios.get('getallgroupandpersongroup', { params : { 'party_id' : party_id}})
  }
  componentDidMount() {
    this.allGroupAndPersonGroup()
      .then((rs)=>{
        let data = rs.data.qs;
        console.log(data.person_group_ids);
        this.setState({
          all_group : data.all_group,
          person_group_ids : data.person_group_ids,
          isLoaded : true
        })
        // console.log(rs);
      })
    document.addEventListener('mousedown', (ev)=>{
      let { classList } = ev.srcElement;
      if( !classList.contains('x-multi') ){
        if( this.state.choicesIsVisible ){
          this.setState({ choicesIsVisible : false });
        }
      }
    });
  }
  saveNewGroup(){
    let { party_id } = this.props;
    let { person_group_ids } = this.state;
    axios.post('savenewpersongroup/', { 'party_id' : party_id, 'group_ids' : person_group_ids } )
      .then((rs)=>{
        this.setState({ isTouched : false });
      })
  }
  consrtuctListGroup(){
    let { all_group, person_group_ids, choicesIsVisible, isTouched } = this.state;
    let group_list = '';
    if( person_group_ids.length ){
      group_list = all_group.map((item, idx)=>{
        if( person_group_ids.indexOf( item.id ) >= 0 ){
          return (
            <li key = { idx } className = 'item'>
              { item.description } 
              <div className = 'multi-remover' onClick = { this.removeItem.bind(this, item) }> x </div>
            </li>
          )
        }
      });
    }else{
      group_list = ( <li className = 'item'> No given group </li>)
    }
    
    let _choices = this.constructChoices();
    return (
      <ul className = 'multi'>
        { group_list }
        <li className = 'multi-adder x-multi'>
          <span  className = 'multi-toggler x-multi' onClick = { this.toggleChoices.bind(this) } >+</span>
          <div className = 'multi-choices x-multi' style = { ({display : choicesIsVisible ? 'block' : 'none'})}>
            { _choices }
          </div>
        </li>
        <li className = 'multi-adder x-multi' style = {({display : isTouched ? 'inline-block' : 'none'})}>
          <span className = 'multi-toggler x-multi' onClick = { this.saveNewGroup.bind(this) }><FA name = 'save'/></span>
        </li>
      </ul>
    )
  }
  toggleChoices(){
    let { choicesIsVisible } = this.state;
    this.setState({choicesIsVisible :!choicesIsVisible});
  }
  addItem(item){
    let _obj = this.state;
    _obj.person_group_ids.push(item.id);

    if( !_obj.isTouched ){
      _obj.isTouched = true;
    }
    this.setState(_obj);
  }
  removeItem( item ){
    let _obj = this.state;
    let idx = _obj.person_group_ids.indexOf(item.id)
    if( idx >= 0 ){
      _obj.person_group_ids.splice(idx, 1);
    }
    _obj.isTouched = true;
    this.setState(_obj);
  }
  inputOnChange(ev){
    let { all_group } = this.state;
    let _val = ev.target.value;
    axios.get('getgroupontyped/', { 'params' : { 'keyWord' : _val } } )
      .then((rs)=>{
        let data = rs.data.qs;
        this.setState({ choices:data });
      })
    this.setState({ inputVal : _val});
  }
  constructChoices(){
    let { choicesIsVisible, choices, inputVal, person_group_ids } = this.state;
   
    let _choices = '';
    if( choices.length ){
      _choices = choices.map((item,idx)=>{
        let cls = '';
        if( person_group_ids.indexOf(item.id) >= 0 ){
          return (
            <li key = { idx } className = 'item already-selected x-multi'> 
              <FA name = 'check'/> 
              {item.description}
            </li>
          )
        }else{
          return (
            <li key = { idx } className = 'item x-multi' onClick = { this.addItem.bind(this, item) }>{item.description}</li>
          )
        }
      })
    }else{
      _choices = ( <li className = 'item x-multi'>Nothing to show</li> )
    }
    
    return (
      <ul className = 'multi-choices'>
        <li className = 'x-multi'>
          <input className = 'x-multi' value = { inputVal } ref = 'input_multi' type = 'text' placeholder = 'Type here' onChange = { this.inputOnChange.bind(this) }/>
        </li>
        { _choices }
      </ul>
    )
  }
  render(){
    let { isLoaded } = this.state;
    let _ul = '', _choices = '';
    if(isLoaded){
      _ul = this.consrtuctListGroup();
    }
    return(
      <div >
        <div>
          Person Group(s):
        </div>
        <div className = 'multi-container'>
          { _ul }
        </div>
      </div>
    )
  }
}
/*
[
          {
            'type' : 'input',
            'name' : 'first_name',
            'label' : 'First name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'middle_name',
            'label' : 'Middle name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'last_name',
            'label' : 'Last name',
            'size' : 2
          },{
            'type' : 'input',
            'name' : 'suffix',
            'label' : 'Suffix',
            'size' : 2
          }
        ],[
          {
            'type' : 'select',
            'name' : 'gender',
            'label' : 'Gender',
            'url' : 'getallgender',
            'size' : 2
          },{
            'type' : 'select',
            'name' : 'some',
            'label' : 'Some',
            'url' : 'getallsome',
            'size' : 2
          },{
            'type' : 'select',
            'name' : 'another',
            'label' : 'Another',
            'url' : 'getallanother',
            'size' : 2
          },{
            'type': 'lookup',
            'name' : 'testlookup',
            'url' : 'getalllookup',
            'label' : 'Look up',
            'size' : 2
          }
        ]
      ]









componentDidMount(){
    let { params } = this.props;
    if( Object.keys( params ).length ){
      // let person_id = params.id;
      // axios.get('getpersoninfo', { params : { 'person_id' : person_id } } )
      //   .then((rs)=>{
      //     let data = rs.data.qs;
      //     let new_inputs = this.setUpValuesOnInput( data );
      //     this.setState({ 
      //       inputs:new_inputs, 
      //       isAdding : false, 
      //       formHeaderTitle : 'Edit Person', 
      //       personId : person_id,
      //       isLoaded : true
      //     });
      //   })
      // this.setState({isLoaded : true})
      let person_id = params.id;
      this.setState({ isAdding : false, isLoaded : true, personId : person_id,formHeaderTitle : 'Edit Person' });
    }else{
      this.setState( { formHeaderTitle : 'Add Person', isLoaded : true } );
    }
  }

let _inputs = [ 
      [ // first block of div
        { 
          'type' : 'input',
          'name' : 'first_name',
          'label' : 'First name',
          'size' : 2
        },{ 
          'type' : 'input',
          'name' : 'middle_name',
          'label' : 'Middle name',
          'size' : 2
        },{ 
          'type' : 'input',
          'name' : 'last_name',
          'label' : 'Last name',
          'size' : 2
        }
      ],
      [ // second block
        { 
          'type' : 'select',
          'name' : 'roletype',
          'label' : 'Roletype',
          'size' : '2',
          'options' : [
            { 'label' : 'Employee', 'value' : '1' },
            { 'label' : 'Supplier', 'value' : '2' },
            { 'label' : 'Customer', 'value' : '3' }
          ]
        }
      ]
    ]
class AddEditForm extends React.Component{
  constructor(props){
    super(props);
    
  }
  componentWillMount(){
    let obj = {};
    let { inputs } = this.props;
    inputs.forEach((item)=>{
      item.forEach((_item)=>{
        if( _item.type == 'input' ){
          obj[ _item.name ] = ''
        }else if( _item.type == 'select' ){
          obj[ _item.name ] = '0';
        }
      })
    });
    this.setState(obj);
  }
  identifyInputTypeContruct( input ){
    let stateVals = this.state;
    if( input.type == 'input' ){
      return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label>{ input.label }</label>
          <input type = 'text' name = { input.name } onChange = { this.handleInputChange.bind(this) }/>
        </div>
      )
    }else if( input.type == 'select' ){
      let choices = [];
      choices.push(
        <option key = 'no_selected' value = '0' disabled> Select </option>
      )
      input.options.forEach((item,idx)=>{
        choices.push(
          <option value = { item.value } key = { idx }>{ item.label}</option>
        )
      });
      
      return (
        <div className = {('input sp'+input.size)} key = { input.name }>
          <label> { input.label }</label>
          <select name = {input.name} value = { stateVals[ input.name ] } onChange = { this.handleInputChange.bind(this) }>
            { choices }
          </select>
        </div>
      )
    }
  }

  constructInput(){
    let { inputs } = this.props;
    let block_input = [];
    inputs.forEach((item,idx)=>{
      let inline_input = [];
      item.forEach((_item)=>{
        inline_input.push(this.identifyInputTypeContruct(_item))
      })
      block_input.push(
        <div key = { idx } className = 'form-block'>
          { inline_input }
        </div>
      );
    })
    return block_input;
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
  handleSubmit(ev) {
    ev.preventDefault();
    let { saveUrl } = this.props;
    axios.post(saveUrl, { 'data' : this.state } )
      .then((rs)=>{
        console.log(rs);
      })
  }
  render(){
    let inputs = this.constructInput();
    return(
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <div className = 'content-form'>
          { inputs }
        </div>
        <button type = 'button' onClick = { this.props.router.goBack.bind(this) }>Cancel</button>
        <button type = 'submit'>Save</button>
      </form>
    )
  }
}
*/
/*
          <div className = 'form-block'>
            <div className = 'input sp2'>
              <label>Name</label>
              <input name = 'first_name'  type = 'text' onChange={this.handleInputChange} />
            </div>
            <div className = 'input sp2'>
              <label>Doctype</label>
              <input name = 'last_name' type = 'text' onChange={this.handleInputChange} />
            </div>
            <div className = 'input sp2'>
              <label>Company</label>
              <input type = 'text' />
            </div>
            <div className = 'input sp2'>
              <label>Date</label>
              <input type = 'text' />
            </div>
          </div>
          <div className ='form-block'>
            <div className = 'input'>
              <label>Location</label>
              <input type = 'text' />
            </div>
          </div>
          <div className = 'form-block'>
            <div className = 'input textarea sp5'>
              <label>Remarks</label>
              <textarea rows='5' cols='50'/>
            </div>
          </div>
*/