import React from 'react';
// import Table from '../../../common/containers/table';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
const FA = require('react-fontawesome');

export default class Group extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      _mod_tree : {},
      _group_list : [],
      _group_module_ids : {},
      _all_group_access : {},
      _module_ids : [],
      isLoaded : false,
      _selected_group : 0,
      isEditing : false
    }
  }
  componentDidMount() {
    axios.get('getappmodulesaxstree/')
      .then((rs)=>{
        let { all_group_access, all_groups, group_module_ids, mod_tree } = rs.data;
        console.log(rs);
        this.setState({
          '_mod_tree' : mod_tree,
          '_group_list' : all_groups,
          '_group_module_ids' : group_module_ids,
          '_all_group_access' : all_group_access,
          'isLoaded' : true
        })
      })
  }
  traverseChildAndUpdateAxs( mod, new_axs ){
    if( mod.childNodes.length ){
      let _child = mod.childNodes;
      for( let x = 0; x < _child.length; x++ ){
        this.traverseChildAndUpdateAxs(_child[x], new_axs);
      }
    }
    if( mod.defn == null ){
      mod.defn = {};
    }
    mod.defn.group_access = new_axs;
  }
  recurseAndGetAxsOfModules( mods, arr, _module_ids, _selected_group, isOkay ){
    if( mods.childNodes.length ){
      let _child = mods.childNodes;
      for( let x = 0; x < _child.length; x++ ){
        this.recurseAndGetAxsOfModules( _child[x], arr, _module_ids, _selected_group, isOkay );
      }
    }
    if( _module_ids.indexOf( mods.id ) >= 0 ){
      if( mods.defn ){ // if not null
        arr.push({app_module_id : mods.id, group_id: _selected_group, group_access_id : mods.defn.group_access.id })
      }else{
        console.log('found null module null axs defn', mods);
      }
    }
  }
  axsModuleDefn(){
    let { _mod_tree, _module_ids, _selected_group } = this.state;
    let arr = [], isOkay = true;
    for( let key in _mod_tree ){
      this.recurseAndGetAxsOfModules(_mod_tree[key], arr, _module_ids, _selected_group, isOkay );
    }
    return arr;
  }
  saveNewGroupDefn(){
    let { _selected_group } = this.state;
    let new_defn = this.axsModuleDefn();
    axios.post('savenewgroupdefinition/', { 'new_defn' : new_defn, 'group_id' : _selected_group })
      .then((rs)=>{
        console.log(rs);
      })
  }
  toggleEdit(){
    let { isEditing, _selected_group } = this.state;
    if( _selected_group ){
      if( isEditing ){
        this.saveNewGroupDefn();
      }
      this.setState({isEditing: !isEditing});
    }else{
      console.log('no selected group to edit');
    }
   
  }
  contructEditBtn(){
    let { isEditing } = this.state;
    let cls = isEditing ? 'on-edit-axs' : '';
    let txt = isEditing ? 'Save' : 'Edit';
    return (
      <div className = {('axs-toggler '+cls)}>
        <button onClick = { this.toggleEdit.bind(this) }>
          {txt}
        </button>
      </div>
    )
  }
  updateModAxs(mod, new_axs){
    let { isEditing, _selected_group } = this.state;
    if( isEditing ){
      if( _selected_group ){
        if( mod.defn == null ){
          mod.defn = {};
        }
        mod.defn.group_access = new_axs;
        let new_mod_tree = this.state._mod_tree;
        this.setState({_mod_tree:new_mod_tree});
      }else{
        console.log('select a group to load first');
      }
    }else{
      console.log('not on editing!');
    }
  }
  
  applyAxsOnChild( mod ){
    let { isEditing, _selected_group } = this.state;
    if( isEditing ){
      if( _selected_group ){
        let parent_axs = mod.defn.group_access;
        this.traverseChildAndUpdateAxs( mod, parent_axs );
        let new_mod_tree = this.state._mod_tree;
        this.setState({_mod_tree:new_mod_tree});
      }else{
        console.log('select a group to load first');
      }
     
    }else{
      console.log('not on editing!');
    }
    
    // console.log('applying axs on child')
  }
  addRemoveMod(mod_id, isRemove){
    let { isEditing, _selected_group } = this.state;
    if( isEditing ){
      if( _selected_group ){
        let { _module_ids } = this.state;
        if( isRemove ){
          // console.log('removing mod id', mod_id);
          let idx = _module_ids.indexOf(mod_id);
          if( idx >= 0 ){
            _module_ids.splice(idx, 1);
          }
        }else{
          _module_ids.push(mod_id);
          // console.log('adding mod id', mod_id);
        }
        this.setState({_module_ids : _module_ids});
      }else{
        console.log('select a group to load first');
      }
    }else{
      console.log('not on editing!');
    }
    
  }
  changeSelectedGroup(ev){
    let grp_id = ev.target.value;
    this.setState({_selected_group:grp_id})
  }
  constructSelectGroup(){
    let { _group_list, _selected_group } = this.state;
    let _opts = _group_list.map((item,idx)=>{
      return(
        <option value = { item.id } key = { idx }>{ item.description }</option>
      )
    })
    return (
      <select value = { _selected_group } onChange = { this.changeSelectedGroup.bind(this) }>
        <option value = '0' disabled>Select a group</option>
        { _opts }
      </select>
    );
  }
  loadGroupModuleIds(){
    let { _selected_group, _group_module_ids } = this.state;
    let ids = _group_module_ids[_selected_group];
    
    if( ids !== undefined ){
      axios.get('getgroupmodulesandaxs/', { 'params' : { 'group_id' : _selected_group } } )
        .then((rs)=>{
          let { mod_tree } = rs.data;
          this.setState({_mod_tree : mod_tree, _module_ids: ids})
        })
    }else{
      this.setState({ _module_ids: []})
    }
  }
  
  render(){
    let { _mod_tree, _all_group_access, isLoaded, _module_ids } = this.state;
    let content = '', selct_grp = '', edit_btn = '';
    if( isLoaded ){ 
      selct_grp = this.constructSelectGroup();
      content = (
        <AppModuleTree 
          all_mods = { _mod_tree }
            all_group_access = { _all_group_access }
              updateModAxs = { this.updateModAxs.bind(this)}
                applyAxsOnChild = { this.applyAxsOnChild.bind(this)}
                  addRemoveMod = { this.addRemoveMod.bind(this)} 
                    module_ids = { _module_ids }/>
      )
      edit_btn = this.contructEditBtn();
    }
    return(
      <div>
        <div>Group</div>
        <div>
          { selct_grp }
          <button onClick = { this.loadGroupModuleIds.bind(this) }>Load</button>
        </div>
        { edit_btn }
        { content }
      </div>
    )
  }
}


class AppModuleTree extends React.Component{
  constructor(props){
    super(props);
  }
  constructList(){
    let { all_mods, all_group_access, module_ids } = this.props;
    let _arr = [];
    for( let key in all_mods ){
      let superParentId = all_mods[key].id;
      _arr.push(
        <ul className = 'mods-grp' key = {key}>
          <ModsListItem  
            mods = { all_mods[key] } 
              updateModAccess = { this.props.updateModAxs.bind(this) } 
                applyAxsOnChild = { this.props.applyAxsOnChild.bind(this) }
                    all_group_access = { all_group_access }
                      addRemoveMod = { this.props.addRemoveMod.bind(this) }
                        ids = { module_ids }/> 
        </ul>
      );
    }
    return _arr;
  }
  render(){
    let {isEditing} = this.props;
    let content = this.constructList();
    return(
      <div className = 'blk'>
        <h4 className = 'hdr'>Modules</h4>
        <div className = 'acs-lvl-tree'>
          <div>{ content }</div>
        </div>
      </div>
    )
  }
}


class ModsListItem extends React.Component{
  constructor(props){
    super(props);
    this.state = { 
      isChangingAxs : false
    }
  }
  // not in use
  constructList(){
    let { mods } = this.props;
    let _arr = [];
    let list_content = '';
    if( mods.childNodes.length ){
      let _child = [];
      mods.childNodes.forEach((item, idx)=>{
        _child.push(<ModsListItem mods = { item } />);
      });
      _arr.push(<li>{mods.description} <ul>{_child}</ul></li>)
    }else{
      _arr.push(<li>{mods.description}</li>)
    }
    return _arr;
  }
  
  constructIcon(){
    let { ids, mods } = this.props;
    if( ids.indexOf( mods.id ) >= 0 ){
      return ( <FA className = 'icon' onClick = { this.props.addRemoveMod.bind(this, mods.id, true ) } name = 'check'/> );
      // return ( <FA className = 'icon' onClick = { this.removeItem.bind(this, mods.id) } name = 'check'/> );
    }else{
      return ( <FA className = 'icon' onClick = { this.props.addRemoveMod.bind(this, mods.id, false ) } name = 'remove'/> );
    }
  }
  
  constructChildContent(){
    let { mods, ids, all_group_access, updateModAccess, applyAxsOnChild } = this.props;
    let _child_content = '';
    if( mods.childNodes.length ){
      let _child = mods.childNodes.map((item, idx)=>{
        return ( 
          <ModsListItem key = { idx } 
            ids = { ids } 
              mods = { item } 
                updateModAccess = { this.props.updateModAccess.bind(this) }
                  applyAxsOnChild = { this.props.applyAxsOnChild.bind(this) }
                    all_group_access = { all_group_access }
                      addRemoveMod = { this.props.addRemoveMod.bind(this) } />);
      });
      _child_content = ( <ul>{_child}</ul>);
    }
    return _child_content;
  }
  constructDefnLbl(){
    let { mods } = this.props;
    // console.log(mods)
    let lbl = '';
    if( mods.defn ){
      lbl = mods.defn.group_access.description;
    }else{
      lbl = 'NOT DEFINED';
    }
    return lbl;
  }
  constructApplyToAllIcon(){
    let { mods } = this.props;
    if( mods.childNodes.length ){
      return ( <FA name = 'check-square' onClick = { this.props.applyAxsOnChild.bind(this, mods) } className = 'd-icon'/> );
    }else{
      return '';
    }
  }
  toggleChangeModAxsList(){
    let { isChangingAxs } = this.state;
    this.setState({isChangingAxs: !isChangingAxs})
  }
  changeModAxs( axs ){
    this.props.updateModAccess( this.props.mods, axs );
    this.setState({isChangingAxs: false})
  }
  
  constructAxsOpt(){
    let { all_group_access } = this.props;
    let _arr = [];
    for( let key in all_group_access ){
      let item = all_group_access[key]
      _arr.push(
        <li key = { key } onClick = { this.changeModAxs.bind(this, item) }> { item.description } </li>
      )
    }
    return _arr;
  }
  render(){
    let { isChangingAxs } = this.state;
    let { mods } = this.props;
    let _lbl = this.constructDefnLbl();
    let _icon = this.constructIcon();
    let _child_content = this.constructChildContent();
    let cls = _child_content != '' ? 'have-child' : '';
    let apply_to_all_icon = this.constructApplyToAllIcon();
    let _axs_opt = this.constructAxsOpt();
    return (
      <li className = {('axs-item ' + cls)}>
        { _icon } 
        <label>
          <span className = 'axs-desc'>{mods.description}</span>
          <span className = 'axs-lbl'> { _lbl } </span>
          <span className = 'axs-icons'>
            <FA name = 'edit' className = 'd-icon' onClick = { this.toggleChangeModAxsList.bind(this) } />
            {apply_to_all_icon}
          </span>
          <div className = 'axs-opt'>
            <ul style = { ( { display : isChangingAxs ? 'block' : 'none' } ) }>
              {_axs_opt}
            </ul>
          </div>
        </label>
        {_child_content} 
      </li>
    )
  }
}
