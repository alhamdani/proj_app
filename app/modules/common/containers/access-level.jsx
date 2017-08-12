import React from 'react';
import { observer, inject } from 'mobx-react';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";
import AccessLvlListComponent from './access-lvl-list';

const FA = require('react-fontawesome');

import Row from 'muicss/lib/react/row';
import Col from 'muicss/lib/react/col';

@inject( 'treeNavAccess', 'userAccess') @observer
export default class AccessLevelComponent extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.props.userAccess.checkAndRedirectIfNone(this);

    let { allHeader, allNav, setNavs } = this.props.treeNavAccess;
    let { treeNavAccess } = this.props;
    axios.all( [ allHeader, allNav ] )
      .then(axios.spread(function(_h, _n){
        treeNavAccess.setHeaders( _h.data.qs);
        treeNavAccess.setNavs( _n.data.qs );
        treeNavAccess.treeBuild();
        this.props.treeNavAccess._isLoaded = true;
        
      }.bind(this)));
  }
  setSelectedEmp( item ){
    this.props.treeNavAccess.resetTreeValues();
    this.props.treeNavAccess.updateTreeStruc( item );
  }
  createList(){
    let temp_arr = [];
    let { treeNavAccess } = this.props;
    let _tree = treeNavAccess._treeStrucArr;
    _tree.forEach(function(el,idx){
      let hierarchy = [];
      temp_arr.push(
        <ListItem 
          key = { idx } 
            node = {el} 
              isHeader = { true } 
                treeNavAccess = { treeNavAccess }
                  headerNode = { el }
                    hierarchy = { hierarchy }/>
      )
    }.bind(this));
    return temp_arr;
  }
  saveAccessChanges(){
    this.props.treeNavAccess.updateEmployeeAccess();
  }
  render(){
    let { _isLoaded, isEditMode } = this.props.treeNavAccess;
    // console.log(isEditMode);
    let tree_list = [];
    if( _isLoaded ){
      tree_list = this.createList();
    }
    return(
      <div>
        <div style = { ( { display : isEditMode ? 'none' : 'block' } ) }>
          <SimpleAutoCompleteInput 
            queryUrl = { 'getallemployee/' } 
              columns = { [ 'first_name', 'last_name' ] }
                selectorFn = { this.setSelectedEmp.bind(this) }/> 
        </div>
        <div className = 'access-level-container'>
          <ul> { tree_list } </ul>
        </div>
        <div>
          <button onClick={ this.saveAccessChanges.bind(this) }>Save Changes</button>
        </div>
      </div>
    )
  }
}

class ListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = { isOptionShown : false };
  }
  updateStatus(){
    let { node, isHeader, parentNode } = this.props;
    let { isSelected } = node;
    this.props.treeNavAccess.updateStatusAndChildNodes( node, isHeader );
  }
  changeAcessStatus( trans, ev ){
    let { node } = this.props;
    this.props.treeNavAccess.updateAccessStatus( node, trans );
    // console.log(stat);
  }
  toggleOptionVisibility(){
    let { isOptionShown } = this.state;
    this.setState({isOptionShown : !isOptionShown});
  }
  isCan( _type ){
    let { access_code } = this.props.node;
    try{
      return access_code.indexOf( _type ) >= 0 ? true : false;
    }catch(e){
      return false;
    }
  }
  addChildNode(){
    let { node } = this.props;
    this.props.treeNavAccess.addChildOnNode( node );
  }
  render(){
    let { node, treeNavAccess, headerNode, hierarchy, isHeader } = this.props;
    let { isEditMode } = treeNavAccess;
    
    let { isSelected } = node;
    let child_list = [];
    let _children = node.childNodes;
    if( _children.length ){
      hierarchy.push(node);
      for( let x = 0; x < _children.length; x++ ){
        child_list.push(
          <ListItem 
            key = { x } 
              isHeader = { false } 
                node = { _children[x] }
                  parentNode = { node }
                    treeNavAccess = { treeNavAccess }
                      headerNode = { headerNode }
                        hierarchy = { hierarchy }/> )
      }
    }
    let { isOptionShown } = this.state;
    let style = { display : isOptionShown ? 'block' : 'none' };
    let _option_list = '';
    let _option_trigger = '';
    if( !isHeader ){
      _option_trigger = (
        <span onClick = { this.toggleOptionVisibility.bind(this) }>
          <FA name = { isOptionShown ? 'angle-down' : 'angle-left' }/>
        </span>
      );
      _option_list = (
        <div className = 'label-options' style = { style }>
          <ul>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'c') } checked = { this.isCan('c') } type = 'checkbox'/>Add</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'r') } checked = { this.isCan('r') } type = 'checkbox'/>View</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'u') } checked = { this.isCan('u') } type = 'checkbox'/>Edit</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'd') } checked = { this.isCan('d') } type = 'checkbox'/>Delete</li>
          </ul>
        </div>
      )
    }
    return(
      <li>
        <div className = 'list-label'>
          <div>
            <input type = 'checkbox' checked = { isSelected } onChange = { this.updateStatus.bind(this) }/>
            <label>{ node.name }</label>
            { _option_trigger }
          </div>
          { _option_list }
        </div>
        <ul>
          {child_list}
        </ul>
      </li>
    )
  }
}

class SimpleAutoCompleteInput extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      value: '',
      options : [],
      listIsShown : false
    }
  }
  query( value ){
    let { columns, queryUrl } = this.props;
    let temp_arr = [];
    if( value.length >=3 ){
       axios.post( queryUrl, { 'search' : value, 'columns' : columns }  )
        .then(function(rs){
          rs.data.qs.forEach(function(el){ temp_arr.push(el);});
          this.setState({
            options : temp_arr
          })
        }.bind(this))
    }else if( value == '' ){
      this.setState({
        options : temp_arr
      })
    }
    
  }
  onChangeHandler(ev){
    let value = ev.target.value;
    this.setState({
      value : value 
    });
    this.query( value );
  }
  clickSelect(item){
    let { columns } = this.props;
    let value = '';
    columns.forEach(function(col, idx){
      let space = '';
      if( idx < columns.length - 1 ){
        space = ' ';
      }
      value += item[col] + space;
    });
    this.setState({
      value : value,
      listIsShown : false
    })
    this.props.selectorFn( item );
  }
  FocusHandler(){
    this.setState({ listIsShown : true });
  }
  BlurHandler(){
    this.setState({ listIsShown : false });
  }
  render(){
    let { value, options, listIsShown } = this.state;
    let options_list = [];
    options.forEach(function(item, idx){
      options_list.push(
        <li key = { idx } onMouseDown = { this.clickSelect.bind(this, item) }>
          { item.first_name } { item.last_name }
        </li>
      )
    }.bind(this));
    let style = { display : listIsShown ? 'block' : 'none' }
    return(
      <div className = 'axs-lvl-c-srch'>
        <label> Employee Name </label>
        <div className ='axs-lvl-ipt' >
          <input ref = 'input' type = 'text' 
            value = { value } 
              onChange  = { this.onChangeHandler.bind(this) } 
                onFocus = { this.FocusHandler.bind(this) }
                  onBlur = { this.BlurHandler.bind(this) }/>

          <ul className = 'options-list' style = { style }>
            { options_list }
          </ul>
        </div>
      </div>
    )
  }
}



























/*
---- before of june 2, 2017 -----

@inject( 'treeNavAccess') @observer
export default class AccessLevelComponent extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    let { allHeader, allNav, setNavs } = this.props.treeNavAccess;
    let { treeNavAccess } = this.props;
    axios.all( [ allHeader, allNav ] )
      .then(axios.spread(function(_h, _n){
        treeNavAccess.setHeaders( _h.data.qs);
        treeNavAccess.setNavs( _n.data.qs );
        treeNavAccess.treeBuild();
        this.props.treeNavAccess._isLoaded = true;
        
      }.bind(this)));
  }
  updateListStatus(){
    
  }
  setSelectedEmp( item ){
    this.props.treeNavAccess.resetTreeValues();
    this.props.treeNavAccess.updateTreeStruc( item );
  }
  createList(){
    let temp_arr = [];
    let { treeNavAccess } = this.props;
    let _tree = treeNavAccess._treeStrucArr;
    _tree.forEach(function(el,idx){
      let hierarchy = [];
      temp_arr.push(
        <ListItem 
          key = { idx } 
            node = {el} 
              isHeader = { true } 
                treeNavAccess = { treeNavAccess }
                  headerNode = { el }
                    hierarchy = { hierarchy }/>
      )
    }.bind(this));
    return temp_arr;
  }
  saveAccessChanges(){
    this.props.treeNavAccess.updateEmployeeAccess();
  }
  addAccessLevel(){

  }
  toggleEditMode(){
    this.props.treeNavAccess.toggleEditMode();
  }
  render(){
    let { _isLoaded, isEditMode } = this.props.treeNavAccess;
    // console.log(isEditMode);
    let tree_list = [];
    if( _isLoaded ){
      tree_list = this.createList();
    }
    return(
      <div>
        <div>
          <button onClick = { this.toggleEditMode.bind(this) }> Edit </button>
        </div>
        <div style = { ( { display : isEditMode ? 'none' : 'block' } ) }>
          <SimpleAutoCompleteInput 
            queryUrl = { 'getallemployee/' } 
              columns = { [ 'first_name', 'last_name' ] }
                selectorFn = { this.setSelectedEmp.bind(this) }/> 
        </div>
        <div className = 'access-level-container'>
          <ul> { tree_list } </ul>
        </div>
        <div>
          <button onClick={ this.saveAccessChanges.bind(this) }>Save Changes</button>
        </div>
      </div>
    )
  }
}

class ListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isOptionShown : false,
      isEditOptionShown : false
    }
  }
  updateStatus(){
    let { node, isHeader, parentNode } = this.props;
    let { isSelected } = node;
    this.props.treeNavAccess.updateStatusAndChildNodes( node, isHeader );
  }
  changeAcessStatus( trans, ev ){
    let { node } = this.props;
    this.props.treeNavAccess.updateAccessStatus( node, trans );
    // console.log(stat);
  }
  toggleOptionVisibility(){
    let { isOptionShown } = this.state;
    this.setState({isOptionShown : !isOptionShown});
  }
  isCan( _type ){
    let { access_code } = this.props.node;
    try{
      return access_code.indexOf( _type ) >= 0 ? true : false;
    }catch(e){
      return false;
    }
  }
  addChildNode(){
    let { node } = this.props;
    this.props.treeNavAccess.addChildOnNode( node );
  }
  deleteNode(){
    console.log(this.props.node.name)
  }
  editNode(){
    console.log('editing node')
  }
  toggleEditOption(){
    let { isEditOptionShown } = this.state;
    this.setState({isEditOptionShown : !isEditOptionShown});
  }
  render(){
    let { node, treeNavAccess, headerNode, hierarchy, isHeader } = this.props;
    let { isEditMode } = treeNavAccess;
    
    let { isSelected } = node;
    let child_list = [];
    let _children = node.childNodes;
    if( _children.length ){
      hierarchy.push(node);
      for( let x = 0; x < _children.length; x++ ){
        child_list.push(
          <ListItem 
            key = { x } 
              isHeader = { false } 
                node = { _children[x] }
                  parentNode = { node }
                    treeNavAccess = { treeNavAccess }
                      headerNode = { headerNode }
                        hierarchy = { hierarchy }/> )
      }
    }
    let { isOptionShown, isEditOptionShown } = this.state;
    let style = { display : isOptionShown ? 'block' : 'none' };
    let _option_list = '';
    let _option_trigger = '';
    if( !isHeader ){
      _option_trigger = (
        <span onClick = { this.toggleOptionVisibility.bind(this) }>
          <FA name = { isOptionShown ? 'angle-down' : 'angle-left' }/>
        </span>
      );
      _option_list = (
        <div className = 'label-options' style = { style }>
          <ul>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'c') } checked = { this.isCan('c') } type = 'checkbox'/>Add</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'r') } checked = { this.isCan('r') } type = 'checkbox'/>View</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'u') } checked = { this.isCan('u') } type = 'checkbox'/>Edit</li>
            <li><input onChange = { this.changeAcessStatus.bind(this, 'd') } checked = { this.isCan('d') } type = 'checkbox'/>Delete</li>
          </ul>
        </div>
      )
    }
    return(
      <li>
        <div className = 'list-label' style = {({display: isEditMode? 'none' : ''})}>
          <div>
            <input type = 'checkbox' checked = { isSelected } onChange = { this.updateStatus.bind(this) }/>
            <label>{ node.name }</label>
            { _option_trigger }
          </div>
          { _option_list }
        </div>
        <div style = {({display: isEditMode? 'block' : 'none'})}>
          <EditNodeContainer node = { node } isHeader = { isHeader } treeNavAccess = { treeNavAccess } />
        </div>
        <ul>
          {child_list}
        </ul>
      </li>
    )
  }
}

class EditNodeContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      isEditOptionShown : false,
      txnCode : 'x',
      isEditNode : false,
      isDeleteNode : false,
      isAddNode : false,
      nameValue : '',
      orderValue : '',
      urlValue : '' 
    }
  }
  toggleEditOption(){
    let { isEditOptionShown } = this.state;
    this.setState({isEditOptionShown : !isEditOptionShown});
  }
  changeTxn(txn){
    this.setState({
      nameValue : '', 
      orderValue : '', 
      urlValue : '',
      txnCode : txn 
    })
  }
  addChildNode(){
    this.changeTxn('a');
  }
  deleteNode(){
    this.changeTxn('d');
  }
  editNode(){
    this.changeTxn('e');
  }
  headerLabel(){
    let { txnCode } = this.state;
    if( txnCode == 'e' ){
      return ' Edit '
    }else if( txnCode == 'd' ){
      return ' Are you sure you want to Delete? '
    }else if( txnCode == 'a' ){
      return ' Add ';
    }else{
      return '';
    }
  }
  proceedDeletingNode(){
    console.log("deleting the node ",this.props.node.name);
  }
  saveNodeUpdate(){
    let {  nameValue, urlValue, orderValue, txnCode } = this.state;
    let { isHeader } = this.props;
    let isEditing = false;
    if( txnCode == 'e' ){
      isEditing = true;
    }
    let _w = {
      'name' : nameValue ,
      'url' : urlValue ,
      'order' : orderValue
    };
    this.props.treeNavAccess.addEditNode( this.props.node, isEditing, isHeader, _w );
  }
  updateName(ev){
    this.setState({nameValue:ev.target.value});
  }
  updateOrder(ev){
    this.setState({orderValue:ev.target.value});
  }
  updateUrl(ev){
    this.setState({urlValue:ev.target.value});
  }
  render(){
    let { isEditOptionShown, nameValue, orderValue, urlValue, txnCode } = this.state;
    let { node } = this.props;
    let axnLabel = this.headerLabel();
    return(
      <div className = 'edit-node-options'>
        <label onClick = { this.toggleEditOption.bind(this) }>{ node.name }</label>
        <div className = 'option-icons' style ={({display : isEditOptionShown ? 'inline-block' : 'none'})}>
          <span className = 'icon' onClick = { this.addChildNode.bind(this) }> 
            <FA name = { 'plus' }/> 
          </span>
          <span className = 'icon' onClick = { this.deleteNode.bind(this) }>
            <FA name = { 'trash' }/>
          </span>
          <span className = 'icon' onClick = { this.editNode.bind(this) }>
            <FA name = { 'edit' }/>
          </span>
          <span className = 'icon' onClick = { this.toggleEditOption.bind(this) }>
            <FA name = 'window-close' />
          </span>
        </div>
        <div className = 'option-container' style = {({display : isEditOptionShown ? 'block' : 'none'})}>
          <div>{ axnLabel }</div>
          <div style = { ({ display : txnCode == 'x' ? 'none' : 'block'}) }>
            <div style = { ({ display : txnCode == 'd' ? 'none' : 'block'}) }>
              <div>
                <label>Name</label>
                <input value = { nameValue } type = 'text' onChange = { this.updateName.bind(this) }/>
              </div>
              <div>
                <label>Order</label>
                <input value = { orderValue } type = 'text' onChange = { this.updateOrder.bind(this) }/>
              </div>
              <div>
                <label>Url</label>
                <input value = { urlValue } type = 'text' onChange = { this.updateUrl.bind(this) }/>
              </div>
              <div>
                <button onClick = { this.saveNodeUpdate.bind(this) }>Save</button>
              </div>
            </div>
            <div style = { ({ display : txnCode == 'd' ? 'block' : 'none'}) }>
              <button onClick = { this.proceedDeletingNode.bind(this) }>Yes</button>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

class SimpleAutoCompleteInput extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      value: '',
      options : [],
      listIsShown : false
    }
  }
  query( value ){
    let { columns, queryUrl } = this.props;
    let temp_arr = [];
    if( value.length >=3 ){
       axios.post( queryUrl, { 'search' : value, 'columns' : columns }  )
        .then(function(rs){
          rs.data.qs.forEach(function(el){ temp_arr.push(el);});
          this.setState({
            options : temp_arr
          })
        }.bind(this))
    }else if( value == '' ){
      this.setState({
        options : temp_arr
      })
    }
    
  }
  onChangeHandler(ev){
    let value = ev.target.value;
    this.setState({
      value : value 
    });
    this.query( value );
  }
  clickSelect(item){
    let { columns } = this.props;
    let value = '';
    columns.forEach(function(col, idx){
      let space = '';
      if( idx < columns.length - 1 ){
        space = ' ';
      }
      value += item[col] + space;
    });
    this.setState({
      value : value,
      listIsShown : false
    })
    this.props.selectorFn( item );
  }
  FocusHandler(){
    this.setState({ listIsShown : true });
  }
  BlurHandler(){
    this.setState({ listIsShown : false });
  }
  render(){
    let { value, options, listIsShown } = this.state;
    let options_list = [];
    options.forEach(function(item, idx){
      options_list.push(
        <li key = { idx } onMouseDown = { this.clickSelect.bind(this, item) }>
          { item.first_name } { item.last_name }
        </li>
      )
    }.bind(this));
    let style = { display : listIsShown ? 'block' : 'none' }
    return(
      <div className ='autocomplete-input' >
        <input ref = 'input' type = 'text' 
          value = { value } 
            onChange  = { this.onChangeHandler.bind(this) } 
              onFocus = { this.FocusHandler.bind(this) }
                onBlur = { this.BlurHandler.bind(this) }/>

        <ul className = 'options-list' style = { style }>
          { options_list }
        </ul>
      </div>
    )
  }
}


---- end for june 2, 2017 ----








  @inject( 'treeNavAccess
    constructor(props){
      super(props);
    }
    componentDidMount(){
      let { allHeader, allNav, setNavs } = this.props.navTreeCreator;
      let { navTreeCreator } = this.props;
      axios.all( [ allHeader, allNav ] )
        .then(axios.spread(function(_h, _n){
          navTreeCreator.setHeaders( _h.data.qs);
          navTreeCreator.setNavs( _n.data.qs );
          this.props.navTreeCreator._isLoaded = true;
        }.bind(this)));
    }
    getNodeChild( item, isHeader ){
      if( isHeader ){
        return this.props.navTreeCreator.headerChild( item );
      }else{
        return this.props.navTreeCreator.nodeChild( item );
      }
    }
    makeHeaderList(){
      let { _headers } = this.props.navTreeCreator;
      let temp_arr = [];
      _headers.forEach(function(el,idx){
        temp_arr.push(
          <ListItem 
            key = { idx } 
              getNodeChildFn = { this.getNodeChild.bind(this) }
                item = { el }
                  isHeader = { true }/>
        )
      }.bind(this))
      return temp_arr;
    }
    render(){
      let { _isLoaded } = this.props.navTreeCreator;
      let _list = [];
      if( _isLoaded ){
        _list = this.makeHeaderList();
      }
      return(
        <div>
          <ul>
            { _list }
          </ul>
        </div>
      );
    }
  }
  class ListItem extends React.Component{
    constructor(props){
      super(props);
      this.state = { 
        'children' : [] 
      }
    }
    getHeaderChild(){
      let { getNodeChildFn, item, isHeader } = this.props;
      let child_list = getNodeChildFn( item, isHeader );
      this.setState({
        children : child_list
      })
    }
    render(){
      let { children } = this.state;
      let { item } = this.props;
      let _list = children.map(function(el, idx){
        return (
          <ListItem 
            key = { idx } 
              getNodeChildFn = { this.props.getNodeChildFn }
                item = { el } 
                  isHeader = { false }/>
        )
      }.bind(this))
      return(
        <li>
          <div onClick = { this.getHeaderChild.bind(this) } >{ item.name }</div>
          <ul>{ _list }</ul>
        </li>  
      )
    }
  }
*/
/*
  @inject( 'navTreeCreator') @observer
  export default class AccessLevelComponent extends React.Component{
    constructor(props){
      super(props);
    }
    componentDidMount(){
      let { allHeader, allNav, setNavs } = this.props.navTreeCreator;
      let { navTreeCreator } = this.props;
      axios.all( [ allHeader, allNav ] )
        .then(axios.spread(function(_h, _n){
          navTreeCreator.setHeaders( _h.data.qs);
          navTreeCreator.setNavs( _n.data.qs );
          navTreeCreator.createTree();
        }.bind(this)));
    }
    constructList(){
      let { _header_tree } = this.props.navTreeCreator;
      let temp_arr = [];
      for( let key in _header_tree ){
        let node = _header_tree[key];
        let nodes_child = node['treeStruc'];
        temp_arr.push(
          <TreeListStruc header = { node } key = { key } nodes = { nodes_child } />
        )
      }
      return temp_arr;
    }
    
    render(){
      let _list = this.constructList();
      return(
        <div>
          <ul>
            { _list }
          </ul>
        </div>
      );
    }
  }
  @inject( 'navTreeCreator') @observer
  class TreeListStruc extends React.Component{
    constructor(props){
      super(props);
      this.state = { isChecked : false };
    }
    render(){
      let { nodes, header } = this.props;
      let { isChecked } = this.state;
      let { isSelected } = header;
      let _list_item = [];
      for(let x = 0; x < nodes.length; x++ ){
        _list_item.push(
          <ListItem key = { x } node = { nodes[x] }/>
        );
      }
      return(
        <li>
          <div>
            <input type = 'checkbox' />
            { header.name }
          </div>
          <ul>
            { _list_item }
          </ul>
        </li>
      )
    }
  }
  @observer
  class ListItem extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      let { node } = this.props;
      let { isSelected } = node;
      let _children = node.childNodes;
      let _list_item = [];
      if( _children.length ){
        for( let x = 0; x < _children.length; x++ ){
          _list_item.push( <ListItem node = { _children[x] } key = { x } /> );
        };
      }
      let _children_block = '';
      if( _list_item.length ){
        _children_block = (
          <ul>{ _list_item }</ul>
        )
      }
      return(
        <li>
          <div>
            <input type = 'checkbox' checked = { isSelected }/>
            { node.name }
          </div>
          { _children_block }
        </li>
      )
    }
  }
*/

/*
  @inject( 'userAccess' ) @observer
  export default class AccessLevelComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        isLoaded : false,
        listTree : {},
        selectedEmp : {},
        originalDataQuery : {},
        accessList : [],
        accessHeaderAndChild : {},
        allHeaderAccess : [],
        allNavAccess : []
      }
    }
    defineNavHeader(data){
      let navDef = this.props.userAccess.defineNavHeader(data, true);
      return navDef;
    }
    constructListTree( _d, isChosenUser, accessObj ){
      let temp_arr = [];
      for( let key in _d ){
        // console.log('on constructListTree', _d[key])
        // this.addFieldOnChildNav( _d[key].child_nav, emp_access );
        temp_arr.push( this.constructTreeOnHeader( _d[key], isChosenUser, accessObj ) );
      }
      return temp_arr;
    }
    updateListTree( tree_list ){
      this.setState({  
        listTree : tree_list
      });
    }
    updateIsLoaded( ){

    }
    componentDidMount(){
      
      axios.all([
        axios.get('getallnavaccess'),
          axios.get('getallheadersaccess')
      ]).then(axios.spread( function(_headers, _navs){
        let _h = _headers.data.qs;
        let _n = _headers.data.qs;
        this.setState({
          allHeaderAccess : _h,
          allNavAccess : _n
        });
      }.bind(this) ))
      axios.get('getallaccesslevel').then(function(rs){
        let data = rs.data.qs;
        
        let temp_obj = {};
        data.forEach( function( item ){
          item.isSelected = false;
          temp_obj[ item.id ] = item;
        })
        let navDef = this.defineNavHeader( data )
        let _tree = this.constructListTree( navDef );
        
        this.updateListTree(_tree);
        // console.log('--->>', temp_obj);
        this.setState({
          isLoaded : true,
          originalDataQuery : temp_obj,
          accessHeaderAndChild : navDef
        })
      }.bind(this))
    }
    constructTreeOnHeader(header, isChosenUser, accessObj ){
      let _tree = {};
      let { originalDataQuery } = this.state;
      _tree.id = header.id;
      _tree.name = header.name;
      _tree.url = header.url;
      _tree.access_code = header.access_code;
      if( isChosenUser ){
        header.child_nav.forEach(function(item){
          let _bol = false;
          if( accessObj[ item.id ] !== undefined ){
            _bol = true;
            item.access_code = accessObj[ item.id ].access_code;
          }
          item.isSelected = _bol;
          originalDataQuery[ item.id ].isSelected = _bol;
        })
      }
      _tree.childNodes = this.props.userAccess.getPageTree( header.child_nav );
      return _tree;
    }
    setSelectedEmp( emp ){
      axios.get('getuseraccess/', { params : { 'emp_id' : emp.id } } )
        .then(function(rs){
          let data = rs.data.qs;
          let temp_obj = {};
          let { accessHeaderAndChild } = this.state;
          data.forEach(function(item){
            temp_obj[ item.id ] = item;
          })
          let _tree = this.constructListTree( accessHeaderAndChild, true, temp_obj );
          this.setState({
            selectedEmp : emp,
            listTree : _tree
          })

        }.bind(this))
    }
    showSelectedEmp(){
      // console.log(this.state.accessHeaderAndChild);
      let { originalDataQuery, selectedEmp } = this.state;
      // console.log('------- - - - - - - - ---------')
      let ids = [];
      for( let key in originalDataQuery ){
        if( originalDataQuery[key].isSelected ){
          // console.log('chosen', originalDataQuery[key]);
          let _e = originalDataQuery[key];
          ids.push( { id : _e.id, access_code : _e.access_code  } );
        }
      }
      axios.post('updateempaccess/', { 'ids' : ids, 'emp' : selectedEmp.id } )
        .then(function(rs){
          console.log(rs);
        })
    }
    updateIsSelectedValue( item ){
      let { originalDataQuery } = this.state;
      let isSelected = item.isSelected;
      item.isSelected = !isSelected;
      originalDataQuery[ item.id ].isSelected = !isSelected;
    }
    updateTrans(item, trans){
      let { originalDataQuery } = this.state;
      originalDataQuery[ item.id ].access_code = trans;
    }
    contentUpdaterFn(){
      
    }
    render(){
      let { listTree, accessList, originalDataQuery,accessHeaderAndChild } = this.state;
      let content = [];
      if( this.state.isLoaded ){
        // content = (<AccessLvlListComponent listTree = { listTree } />);
        for( let x = 0; x < listTree.length; x++ ){
          let obj = listTree[x];
          content.push(
            <li key = { x }>
              <AccessLvlListTree 
                updateIsSelectedValue = { this.updateIsSelectedValue.bind(this) } 
                  updateTrans = { this.updateTrans.bind(this) }
                    accessList = { accessList } node = { obj }/>
            </li>
          )
        }
        
      }
      return (
        <Row>
          <ModalForm originalDataQuery = { originalDataQuery } accessHeaderAndChild = { accessHeaderAndChild } />
          <Col md = '12'>
            <div>
              Employee : 
              <SimpleAutoCompleteInput 
                queryUrl = { 'getallemployee/' } 
                  columns = { [ 'first_name', 'last_name' ] }
                    selectorFn = { this.setSelectedEmp.bind(this) }/> 
            </div>
            <div>
              <button onClick = { this.showSelectedEmp.bind(this) } >Test</button>
              <div>
                Account type : Killer
              </div>
              <div>
                
                <div>
                  Access Level <span>Add Page</span>
                </div>
                <div className ='access-level-container'>
                  <ul className = 'access-list'>
                    { content }
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )
    }
  }
*/

/*
  export default class AccessLevelComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        isLoaded : false,
        allHeaderAccess : [],
        allNavAccess : [],
        selectedAccess : {},
        selectedEmp : '',
        empAccessList : []
      }
    }
    defineChildren( id, list ){
      let temp_arr = [];
      list.forEach(function(el){
        if( id == el.header_id ){
          temp_arr.push(el);
        }
      });
      return temp_arr;
    }
    componentDidMount(){
      axios.all([
        axios.get('getallnavaccess'),
          axios.get('getallheadersaccess')
      ]).then(axios.spread( function( _navs, _headers ){
        let _arr = [];
        let _h = _headers.data.qs;
        let _n = _navs.data.qs;
        for( let x = 0; x < _h.length; x++ ){
          _h[x].childNodes = this.defineChildren(_h[x].id, _n);
        }
        this.setState({
          allHeaderAccess : _h,
          allNavAccess : _n
        });
      }.bind(this)))
    }
    setSelectedEmp( item_selected ){
      axios.get('getuseraccess/', { params : { 'emp_id' : item_selected.id } } )
        .then(function(rs){
          let data = rs.data.qs;
          this.setState(
              { 
                selectedEmp : item_selected,
                empAccessList : data
              }
            )
            console.log(data);
        }.bind(this))
    
    }
    updateAccess( item, isChecked ){
      let { selectedAccess } = this.state;
      if( isChecked ){
        selectedAccess[ item.id ] = item;
      }else{
        delete selectedAccess[item.id]
      }
      this.setState( { selectedAccess: selectedAccess } );
    }
    setEmpAccess(){

    }
    showChildren(){

    }
    showAllAccess(){
      console.log(this.state.selectedAccess);
    }
    render(){
      let { allHeaderAccess, allNavAccess, selectedEmp, empAccessList } = this.state;
      let header_list = [];
      header_list = allHeaderAccess.map(function(el, idx){
        let arrow = '';
        // console.log('on loop value of idx ', idx, ' el ', el);
        return(
          <PagesList 
            key = { idx }
              item = { el }
                defineChildren = { this.defineChildren.bind(this) } 
                  allNavAccess = { allNavAccess }
                    isHeader = { true } 
                      selectedEmp = { selectedEmp }
                        empAccessList = { empAccessList }
                          updateAccess = { this.updateAccess.bind(this) } />
        );
      }.bind(this))
      return(
        <Row>
          <Col md = '12'>
            <div>
              Employee : 
              <SimpleAutoCompleteInput 
                queryUrl = { 'getallemployee/' } 
                  columns = { [ 'first_name', 'last_name' ] }
                    selectorFn = { this.setSelectedEmp.bind(this) }/> 
              <button onClick = { this.showAllAccess.bind(this) }>Save</button>
            </div>
            <div>
              <ul>
                { header_list }
              </ul>
            </div>
          </Col>
        </Row>
      )
    }
  }
*/

/*
  export default class AccessLevelComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        allHeaderAccess : [],
        allNavAccess : []
      }
    }
    treeConstruct(_headers, _navs){
      let temp_obj = {};

    }
    componentDidMount(){
      axios.all([
        axios.get('getallnavaccess'),
          axios.get('getallheadersaccess')
            ]).then(axios.spread( function( _navs, _headers ){
              let _arr = [];
              let _h = _headers.data.qs;
              let _n = _navs.data.qs;
              _h.forEach(function(el){el.childNodes = []; el.isSelected = false;});
              _n.forEach(function(el){el.childNodes = []; el.isSelected = false;});
              this.setState({
                allHeaderAccess : _h,
                allNavAccess : _n
              });
            }.bind(this)))
    }
    getChildren(item){
      let { allNavAccess } = this.state;
      if( item.parent_id !== undefined ){ // if the item is not header. Note: header have no parent_id
        let temp_arr = [];
        for( let x = 0; x < allNavAccess.length; x++ ){
          if( allNavAccess[x].parent_id == item.id ){
            temp_arr.push(allNavAccess[x]);
          }
        }
        return temp_arr;
      }else{
        let temp_arr = [];
        for( let x = 0; x < allNavAccess.length; x++ ){
          if( item.id == allNavAccess[x].header_id && allNavAccess[x].parent_id == 0 ){
            temp_arr.push(allNavAccess[x])
          }
        }
        return temp_arr;
      }
      
    }
    updateChild(item){
      let { allNavAccess } = this.state;
      for( let x = 0; x < allNavAccess.length; x++ ){
        if( item.id == allNavAccess[x].header_id && allNavAccess[x].parent_id == 0 ){
          allNavAccess[x].isSelected = false;
        }
      }
    }
    testBtn(){
      console.log(this.state.allHeaderAccess);
    }
    render(){
      let { allHeaderAccess } = this.state;
      let header_list = allHeaderAccess.map(function(el,idx){
        return(
          <PageList 
            key = {idx} 
              item = {el}
                getChildren = {this.getChildren.bind(this)} 
                  updateChild = {this.updateChild.bind(this)} />
        )
      }.bind(this))
      return(
        <div>
      <button onClick = { this.testBtn.bind(this) }>test btn</button>
          <ul>{ header_list }</ul>
        </div>
      )
    }
  }

*/

/*
  class PageList extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        isChecked : '',
        haveChildren : false,
        children : []
      }
    }
    componentDidMount(){
      let { isSelected } = this.props.item;
      this.setState({isChecked : isSelected})
    }
    showChildren(){
      let childList = this.getChildren();
      this.setState({
        children : childList
      })
    }
    getChildren(){
      let { item } = this.props;
      return this.props.getChildren(item);
    }
    toggleIsSelected(){
      let { isSelected } = this.props.item;
      this.props.item.isSelected = !isSelected;
      this.setState({isChecked : !isSelected});
      this.props.updateChild( this.props.item );
    }
    render(){
      let { item, getChildren, updateChild } = this.props;
      let { isSelected } = item;
      let { children, isChecked } = this.state;
      let chxbox = '';
      let _children = children.map(function(el,idx){
        return(
          <PageList 
            key = { idx } 
              getChildren = { getChildren } 
                updateChild = { updateChild }
                  item = { el } />
        )
      })
      return(
        <li>
          <input type = 'checkbox' checked = { isChecked } onChange = { this.toggleIsSelected.bind(this) }/>
          <label onClick = {this.showChildren.bind(this)}>{item.name}</label>
          <ul>{ _children }</ul>
        </li>
      )
    }
  }
*/
/*
  class PagesList extends React.Component{
    constructor(props){
      super(props);
      this.state = { 
        children : [],
        isChecked : false,
        employee : '',
        haveChild : false,
        isChildVisible : false
      }
    }
    componentDidMount(){
      let { item, empAccessList } = this.props;
      let _chld = this.checkForChildren(item);
      let temp_obj = {};
      if( _chld.length ){
        temp_obj[ 'haveChild' ] = true;
      }
      temp_obj['isChecked'] = this.checkIfHaveAccess(empAccessList, item);
      this.setState(temp_obj);
    }
    showChildList(){
      let temp_arr = this.checkForChildren();
      let { isChildVisible } = this.state;
      let temp_obj = {}
      if( !isChildVisible ){
        temp_obj['children'] = temp_arr;
      }
      temp_obj['isChildVisible'] = !isChildVisible
      this.setState(temp_obj);
    }
    checkForChildren(){
      let { isHeader } = this.props;
      let temp_arr = [];
      if( isHeader ){
        temp_arr = this.getChildren( 'header_id' );
      }else{
        temp_arr = this.getChildren( 'parent_id' )
      }
      return temp_arr;
    }
    getChildren( col ){
      let { item, allNavAccess, isHeader } = this.props;
      let temp_arr = [];
      allNavAccess.forEach(function(el){
        if( item.id == el[ col ] ){
          if( isHeader ){
            if( el.parent_id == 0 ){
              temp_arr.push( el );
            }
          }else{
            temp_arr.push( el );
          }
        }
      })
      return temp_arr;
    }
    onChangeHandler(){
      let { isChecked } = this.state;
      let { item } = this.props;
      this.setState({
        isChecked : !isChecked
      });
    }
    checkIfHaveAccess( accessList, item ){
      // console.log(accessList);
      for( let x = 0; x < accessList.length; x++ ){
        if( item.id == accessList[x].id ){
          return true;
        }
      }
      return false;
    }
    checkInputValue( _fn, props ){
      if( _fn == 'bluitin'){
        let _val = this.checkIfHaveAccess( props.empAccessList, props.item);
        this.setState({isChecked : _val});
      }
    }
    componentWillReceiveProps(nextProps, nextState){
      this.checkInputValue( 'bluitin', nextProps );
    }
    render(){
      let { children, isChecked, haveChild, isChildVisible } = this.state;
      let { item, defineChildren, allNavAccess, selectedEmp, updateAccess, empAccessList } = this.props;
      let li_content = '';
      let li_label = '';
      if( children.length ){
        let childList = children.map(function(el,idx){
          return( 
            <PagesList key = { idx }
                item = { el }
                  defineChildren = { defineChildren }
                    allNavAccess= { allNavAccess }
                      isHeader = { false }
                        selectedEmp = { selectedEmp }
                          updateAccess = { updateAccess }
                            empAccessList = { empAccessList }/>
          )
        })
        li_content = (
          <ul style = { ( { display : isChildVisible ? 'block' : 'none' } ) }>{ childList }</ul>
        )
      }
      if( haveChild ){
        li_label = ( 
          <span onClick = { this.showChildList.bind(this) } >
            {item.name} &nbsp;
            <FA name = { isChildVisible ? 'angle-down' : 'angle-left' }/> 
          </span>
        );
      }else{
        li_label = (<span><input type = 'checkbox' checked = { isChecked } onChange = { this.onChangeHandler.bind(this) }/> {item.name} </span>)
      }
      return(
        <li>
          { li_label }
          { li_content }
        </li>
      )
    }
  }
*/











class ModalForm extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      headers : [],
      pages : []
    }
  }
  componentDidMount(){
    
  }
  changeHeader(ev){
    console.log(ev.target.value);
  }
  render(){
    let { headers, pages } = this.state;
    let { accessHeaderAndChild } = this.props;
    let h_list = [];
    if( accessHeaderAndChild !== undefined ){
      for( let key in accessHeaderAndChild ){
        let el = accessHeaderAndChild[key];
        h_list.push(
          <option key = { key } value = { el.id }>{ el.name }</option>
        )
      }
    }

    return(
      <div className = 'add-page page-modal'>
        <div className = 'modal-content'>
          <div className = 'modal-header'> Add Access</div>
          <div className = 'modal-body'>
            <div>
              <label>Url</label>
              <input type = 'text' />
            </div>
            <div>
              <label>Parent page</label>
              <select>
                <option>One</option>
              </select>
            </div>
            <div>
              <label>Header</label>
              <select onChange = { this.changeHeader.bind(this) }>
                { h_list }
              </select>
            </div>
            <div>
              <label>Order</label>
              <input type = 'number' />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class EmployeeTable extends React.Component{
  render(){
    return (
      <table className = 'tbl-v-2'>
        <thead>
          <tr>
            <th></th>
            <th>Fullname</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type = 'checkbox'/></td>
            <td>Fullname is here</td>
          </tr>
        </tbody>
      </table>
    )
  }
}
class AccessLvlListTree extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      isChecked : false,
      canUpdate : false,
      canDelete : false,
      canView : false,
      canCreate : false,
      accessSummary : ''
    }
  }
  componentDidMount(){
    let { isSelected, access_code } = this.props.node;
    this.setState({ 
      isChecked : isSelected
    });
  }
  toggleCheckbox(ev){
    let { isChecked } = this.state;
    let _isChecked = this.props.node;
    this.setState({ isChecked : !isChecked });
    this.props.updateIsSelectedValue(this.props.node);
  }
  isOnTheList(){
    let { accessList, node } = this.props;
    let isFound = false;
    for( let x = 0; x < accessList.length; x++ ){
      if( node.id === accessList[ x ].id ){
        isFound = true;
        break;
      }
    }
    return isFound;
  }
  getCheckedValue(){
    if( this.isOnTheList() ){
      return true
    }
    return this.state.isChecked;
  }
  accessCheckerObj( access_code ){
    let c = access_code.indexOf('c');
    let r = access_code.indexOf('r');
    let u = access_code.indexOf('u');
    let d = access_code.indexOf('d');
    let obj = {
      'canUpdate' : false, 
      'canDelete' : false, 
      'canView' : false, 
      'canCreate' : false,
    };
    if( c >= 0 )obj['canUpdate'] = true;
    if( r >= 0 ) obj['canDelete'] = true;
    if( u >= 0 ) obj['canView'] = true;
    if( d >= 0 ) obj['canCreate'] = true;
    return obj;
  }
  componentWillReceiveProps(){
    let { access_code } = this.props.node;
    if( access_code !== undefined ){
      let obj = this.accessCheckerObj( access_code );
      obj.accessSummary = access_code;
      // console.log(obj);
      this.setState(obj);
    }
  }
  redefineAccessTransacrion(){

  }
  defn(_code){
    if( _code == 'canUpdate' ) return 'u';
    if( _code == 'canDelete' ) return 'd';
    if( _code == 'canView' ) return 'r';
    if( _code == 'canCreate') return 'c';
  }
  changeAccessTransaction( trans, item ){
    let { accessSummary } = this.state;
    let { access_code } = this.props.node;
    console.log('changing', trans, 'with access code ', this.props.node.access_code )
    let currentVal = this.state[trans];
    console.log(currentVal);
    let obj = {};
    obj[ trans ] = !currentVal;
    if( currentVal == true ){
      let dfn = this.defn( trans );
      // let idx = access_code.indexOf(dfn);
      accessSummary = accessSummary.replace(dfn, '');
      // console.log('dfn',dfn, 'idx', idx);
    }else{
      let dfn = this.defn(trans);
      accessSummary += dfn;
    }
    this.setState({ accessSummary : accessSummary });
    this.props.updateTrans(item, accessSummary );
    this.setState(obj);
  }
  render(){
    let { node, accessList, updateIsSelectedValue, updateTrans } = this.props;
    let { isSelected, access_code } = node;
    let { canCreate, canDelete, canView, canUpdate } = this.state;
    
    let childList = [];
    let tstNoChild = '';
    let objAccess = {};
    let content = '';
    
    if( node.childNodes.length > 0 ){
      for( let x = 0; x < node.childNodes.length; x++ ){
        childList.push(
          <li key = {x}>
            <AccessLvlListTree 
              updateIsSelectedValue = { updateIsSelectedValue.bind(this) } 
                accessList = { accessList } node = { node.childNodes[x] } 
                  updateTrans = { updateTrans.bind(this) } />
          </li>
        )
      }
      content = (
        <div>
          <div>
            { node.name }
          </div>
          <ul className = 'access-list-child'>
            { childList }
          </ul>
        </div>
      )
    }else{
      let style = {  display : isSelected ? 'block' : 'none' }
      content = (
        <div className = 'able-to-select'>
          <input type = 'checkbox' onChange = { this.toggleCheckbox.bind(this) } checked = { isSelected } />
          { node.name }
          <div className = 'transaction-access-list' style = { style }>
            <ul>
              <li>
                <input type = 'checkbox' onChange = { this.changeAccessTransaction.bind(this, 'canUpdate', node ) } checked = { canUpdate }/>
                <label>Can Edit</label>
              </li>
              <li>
                <input type = 'checkbox' onChange = { this.changeAccessTransaction.bind(this, 'canDelete', node ) } checked = { canDelete }/>
                <label>Can Delete</label>
              </li>
              <li>
                <input type = 'checkbox' onChange = { this.changeAccessTransaction.bind(this, 'canView', node ) } checked = { canView }/>
                <label>Can Create</label>
              </li>
              <li>
                <input type = 'checkbox' onChange = { this.changeAccessTransaction.bind(this, 'canCreate', node ) } checked = { canCreate }/>
                <label>Can View</label>
              </li>
            </ul>
          </div>
        </div>
      )
    }
    return(
      <div> { content } </div>
    )
  }
}

