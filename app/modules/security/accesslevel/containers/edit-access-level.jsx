import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
const FA = require('react-fontawesome');
export default class EditAccessLevel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      _mod_tree : {},
      isEditing : false,
      isLoaded : false,
      isCustom : false,
      _person_group_ids : [],
      _all_groups : [],
      _all_group_access : {},
      _person_app_module_ids : [],
      _person_group_access_ids : [],
      _group_app_module_tree : {},
      _person_personal_info : {},
      _person_groups : [],
      _group_module_ids : {},
      _original_person_module_ids : []
    }
  }
  recurseOnModules(mod, _arr){
    mod.childNodes.forEach((item)=>{
      _arr.push(item.id)
      if( item.childNodes.length ){
        this.recurseOnModules(item, _arr);
      }
    })
    return _arr;
  }
  getModuleIds(all_mods){
    let _arr = [];
    all_mods.forEach((item)=>{
      _arr.push(item.id);
      if( item.childNodes.length ){
        this.recurseOnModules(item, _arr);
      }
    })
    return _arr;
  }
  personInfo(){
    let { params } = this.props.router;
    return (axios.get('getpersoninfo', { 'params' : { 'party_id' : params.id } }));
  }
  personAccess(){
    let { params } = this.props.router;
    return ( axios.get('getpersonaccess', { 'params' : { 'party_id' : params.id } } ) );
  }
  componentDidMount(){
    let { params } = this.props.router;
    
    axios.all([ this.personAccess() ,this.personInfo() ] )
      .then(axios.spread( (rs, _rs) => {
        let { modules_tree ,person_app_module_ids, person_groups, all_group_access, all_groups, person_group_ids, group_module_ids  } = rs.data;
        console.log(rs.data);
        let person_info = _rs.data.qs;
          this.setState({
            isLoaded : true,
            _mod_tree : modules_tree,
            _person_app_module_ids : person_app_module_ids,
            _original_person_module_ids : person_app_module_ids.slice(),
            _person_personal_info : person_info,
            // _person_groups : person_groups,
            _all_group_access : all_group_access,
            _all_groups : all_groups,
            _person_group_ids : person_group_ids,
            _group_module_ids : group_module_ids
          });
      }))
   
  }
  recurseAndGetAxsOfModules( mods, arr, person_mods_ids, _person_group_ids ){
    if( mods.childNodes.length ){
      let _child = mods.childNodes;
      for( let x = 0; x < _child.length; x++ ){
        this.recurseAndGetAxsOfModules( _child[x], arr, person_mods_ids, _person_group_ids );
      }
    }
    if( person_mods_ids.indexOf( mods.id ) >= 0 ){
      // console.log(mods.defn);
      let max = _person_group_ids.length;
      let min = 0;
      let rndom_idx = (Math.floor(Math.random() * (max - min)) + min)
      // generate a ranomd index to select 
      let random_id_from_group_id = _person_group_ids[rndom_idx];
      arr.push({app_module_id : mods.id, group_id: random_id_from_group_id, group_access_id : mods.defn.group_access.id })
    }
  }
  axsModuleDefn(){
    let { _mod_tree, _person_app_module_ids, _person_group_ids } = this.state;
    let arr = [];
    for( let key in _mod_tree ){
      this.recurseAndGetAxsOfModules(_mod_tree[key], arr, _person_app_module_ids, _person_group_ids );
    }
    return arr;
  }
  haveChanges(){
    let { _original_person_module_ids, _person_app_module_ids } = this.state;
    // first check
    for( let x = 0; x < _person_app_module_ids.length; x++ ){
      let item = _person_app_module_ids[x];
      let idx = _original_person_module_ids.indexOf(item);
      if( idx < 0 ){
        return true;
      }
    }
    // second check
    for( let x = 0; x < _original_person_module_ids.length; x++ ){
      let item = _original_person_module_ids[x];
      let idx = _person_app_module_ids.indexOf(item);
      if( idx < 0 ){
        return true;
      }
    }
    return false;
  }
  saveNewAccessLevel(){
    let new_axs_defn = this.axsModuleDefn();
    let { params } = this.props.router;
    console.log()
    axios.post('savenewpartylevelaccess/', {'new_axs_defn' : new_axs_defn, 'party_id' : params.id })
      .then((rs)=>{
        if( rs.data.message == 'success' ){
          this.props.router.goBack()
        }
      })
   
  }
  toggleEdit(){
    let { isEditing } = this.state;
    if( isEditing ){
      this.saveNewAccessLevel();
    }else{
      console.log('editing state');
    }
    this.setState({isEditing : !isEditing});
  }
  toggleCustom(ev){
    this.setState({isCustom : ev.target.checked})
  }
  
  traverseModTree( mod, new_axs ){ }
  updateModAxs(mod, new_axs){
    let { isEditing } = this.state;
    if( isEditing ){
      if( mod.defn == null ){
        mod.defn = {};
      }
      mod.defn.group_access = new_axs;
      let new_mod_tree = this.state._mod_tree;
      this.setState({_mod_tree:new_mod_tree});
    }else{
      console.log('you are not in editing mode')
    }
  }
  loadDefnOfGroup( group_id ){
    let { _group_app_module_tree } = this.state;
    // console.log( _group_app_module_tree[ group_id ])
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
  applyAxsOnChild(mod){
    let { isEditing } = this.state;
    if( isEditing ){
      let parent_axs = mod.defn.group_access;
      this.traverseChildAndUpdateAxs( mod, parent_axs );
      let new_mod_tree = this.state._mod_tree;
      this.setState({_mod_tree:new_mod_tree});
    }else{
      console.log('you are not in editing mode')
    }
    
  }
  traverseAndGetModuleTreeIds( mods, storage ){
    if( mods.childNodes.length ){
      let _child = mods.childNodes;
      for( let x = 0; x < _child.length; x++ ){
        this.traverseAndGetModuleTreeIds( _child[x], storage );
      }
    }
    storage.push( mods.id );
  }
  findModsOnModuleTree(mods, mod_id){
    if( mods.id == mod_id ){
      return mods;
    }
    if( mods.childNodes.length ){
      let _child = mods.childNodes;
      for( let x = 0; x < _child.length; x++ ){
        let _mod = this.findModsOnModuleTree( _child[x], mod_id );
        if( _mod ){
          return _mod;
        }
      }
    }
    return null;
  }
 
  addRemoveMod(mod_id, isRemove, superParentId){
    let { isEditing } = this.state;
    if( isEditing ){
      let { _person_app_module_ids, _mod_tree } = this.state;
      if( isRemove ){
        let idx = _person_app_module_ids.indexOf(mod_id);
        _person_app_module_ids.splice(idx, 1);
      }else{
        _person_app_module_ids.push(mod_id);
      }
      // console.log(_mod_tree[superParentId]);
      // let val = this.findModsOnModuleTree(_mod_tree[superParentId], mod_id);
      // console.log(val);
      // console.log('found', val)
      let _arr_ids = [];
      // this.traverseAndGetModuleTreeIds(_mod_tree[superParentId], _arr_ids);
      // console.log(_arr_ids);
      this.setState({_person_app_module_ids : _person_app_module_ids});
      // console.log(_person_app_module_ids);
    }else{
      console.log('you are not in editing mode')
      
    }
  }
  addRemoveGroup(group_id, isRemove){
    let { isEditing } = this.state;
    if( isEditing ){
      let { _person_group_ids, _group_module_ids, _person_app_module_ids } = this.state;
      let grp_modules = _group_module_ids[ group_id ] !== undefined ? _group_module_ids[ group_id ] : [];
      // console.log('person app module id',_person_app_module_ids.sort())
      // console.log('group module ids', grp_modules.sort())
      // console.log(,, group_id);
      if( isRemove ){
        // remove group
        let idx = _person_group_ids.indexOf(group_id);
        _person_group_ids.splice(idx, 1);
        grp_modules.forEach((id)=>{
          let idx = _person_app_module_ids.indexOf(id);
          if( idx >= 0 ){
            _person_app_module_ids.splice(idx,1);
          }
        });
      }else{
        // add group
        // console.log(_person_app_module_ids);
        _person_group_ids.push(group_id);
        let temp = [];
        grp_modules.forEach((id)=>{
          _person_app_module_ids.push(id);
        })
      }

      this.setState({_person_group_ids:_person_group_ids, _person_app_module_ids : _person_app_module_ids });
    }else{
      console.log('you are not in editing mode')
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
  render(){
    let { isEditing, isCustom, _mod_tree, isLoaded, _person_app_module_ids, _person_group_ids, _person_personal_info, _person_groups, _all_group_access, _all_groups } = this.state;
    let app_module_content = '', personal_info_content = '', person_group = '', editBtnToggler = '';
    if( isLoaded ){
      personal_info_content = (
        <div className = 'blk'>
          <h4 className = 'hdr'>Person Infomation</h4>
          <PersonalInformationBlk person_personal_info = { _person_personal_info }/>
        </div> );

      person_group = (
        <div className = 'blk'>
          <h4 className = 'hdr'>Group</h4>
          <PersonSystemGroupBlk 
            person_groups = { _person_groups } 
              person_group_ids = { _person_group_ids } 
                all_groups = {_all_groups}
                  addRemoveGroup = { this.addRemoveGroup.bind(this) }/>
        </div> );

      // let _c = isEditing ? 'editing-state axs-lvl-container' : 'axs-lvl-container';
      app_module_content = (
        <div>
          <AppModuleTree 
            all_mods = { _mod_tree } 
              all_group_access = { _all_group_access } 
                person_app_module_ids = { _person_app_module_ids }
                  updateModAxs = { this.updateModAxs.bind(this) } 
                    applyAxsOnChild = { this.applyAxsOnChild.bind(this) } 
                      addRemoveMod = { this.addRemoveMod.bind(this) }/>
        </div> );
      editBtnToggler = this.contructEditBtn();
    }
    return(
      <div>
       
        { personal_info_content }
         {editBtnToggler}
        { person_group }
        { app_module_content }
      </div>
    )
  }
}

class PersonSystemGroupBlk extends React.Component{
  constructor(props){
    super(props);
  }
  constructGroupLbl(){
    let { person_groups } = this.props;
    let lbl = '';
    person_groups.forEach((item,idx)=>{
      let sprtor = '';
      if( (idx + 1) < person_groups.length ){
        sprtor = ', '
      }
      lbl += item.description + sprtor;
    });
    return lbl;
  }
  addPersonGroup(){
    console.log('trying to add group');
  }
  constructGroupSelect(){
    // console.log( this.props.person_group_ids, this.props.all_groups)
    return (
      <ul>
        <li>Group one</li>
        <li>Group two</li>
        <li>Group three</li>
        <li>Group four</li>
      </ul>
    )
  }
 
  createIcon( group_id ){
    let grp_ids = this.props.person_group_ids;
    if( grp_ids.indexOf( group_id ) >= 0 ){
      return ( <FA name = 'check' onClick = { this.removeAccess.bind(this, group_id) }/>)
    }else{
      return ( <FA name = 'remove' onClick = { this.addAccess.bind(this, group_id) }/>)
    }
  }
  removeAccess( group_id ){
    this.props.addRemoveGroup( group_id, true);
  }
  addAccess(group_id){
    this.props.addRemoveGroup( group_id, false);
  }
  constructGroupList(){
    let { all_groups } = this.props;
    let _arr = [];
    
    all_groups.forEach((item,idx)=>{
      let _icon = this.createIcon( item.id );
      _arr.push(
        <li key = { idx }> 
          { _icon } { item.description }
        </li> );
    })
    return _arr;
  }
  /*constructGroupList(){
    let { person_groups } = this.props;
    let _arr = [];
    person_groups.forEach(( item, idx ) => {
      _arr.push( <li key = { idx }> { item.description } <FA name = 'trash'/> </li> );
    })
    let groupOpt = this.constructGroupSelect();
    _arr.push(
      <li key = 'add-group' onClick = { this.addPersonGroup.bind(this) }>
        <FA name = 'plus'/> Add group
        { groupOpt }
      </li>);
    return _arr;
  }*/
  render(){
    let lbl = this.constructGroupLbl();
    let grp_li = this.constructGroupList();
    return (
      <div>
        <ul>
          { grp_li }
        </ul>
      </div>
    )
  }
}

class AppModuleTree extends React.Component{
  constructor(props){
    super(props);
  }
  updateModAccessFn( mod, new_axs ){
    this.props.updateModAxs(mod, new_axs);
  }
  applyAxsOnChild( mod ){
    this.props.applyAxsOnChild( mod );
    // console.log('applying axs of ', mod, 'child');
  }

  // lvl1 is the most parent which is the header
  constructList(){
    let { all_mods, person_app_module_ids, all_group_access } = this.props;
    let _arr = [];
    for( let key in all_mods ){
      let superParentId = all_mods[key].id;
      _arr.push(
        <ul className = 'mods-grp' key = {key}>
          <ModsListItem  
            mods = { all_mods[key] } 
              updateModAccess = {this.updateModAccessFn.bind(this) } 
                applyAxsOnChild = { this.applyAxsOnChild.bind(this) }
                  ids = { person_app_module_ids } 
                    all_group_access = { all_group_access }
                      addRemoveMod = { this.props.addRemoveMod.bind(this) }
                        superParentId = { superParentId }/> 
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
  }//not in use
  removeItem( mods_id ){
    let { superParentId } = this.props;
    this.props.addRemoveMod(mods_id, true, superParentId );
  }
  addItem( mods_id ){
    let { superParentId } = this.props;
    this.props.addRemoveMod( mods_id, false, superParentId );
  }
  constructIcon(){
    let { ids, mods } = this.props;
    // console.log(ids.indexOf( mods.id ),ids, mods.id, mods.description)
    if( ids.indexOf( mods.id ) >= 0 ){
      return ( <FA className = 'icon' onClick = { this.removeItem.bind(this, mods.id) } name = 'check'/> );
    }else{
      return ( <FA className = 'icon' onClick = { this.addItem.bind(this, mods.id) } name = 'remove'/> );
    }
  }
  
  constructChildContent(){
    let { mods, ids, all_group_access, updateModAccess, applyAxsOnChild, superParentId } = this.props;
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
                      addRemoveMod = { this.props.addRemoveMod.bind(this) } 
                        superParentId = { superParentId }/>);
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
  enterOnIcons(){
    let { tooltipVisible } = this.state;
    this.setState( { tooltipVisible : !tooltipVisible } );
  }
  onOneIcon(code){
    if( code == 'e' ){
      this.setState({tooltipText:'Change Module Access'});
    }else if( code == 'a'){
      this.setState({tooltipText:'Apply access to all children'})
    }else{
      this.setState({tooltipText:''})
    }
  }
  constructApplyToAllIcon(){
    let { mods } = this.props;
    if( mods.childNodes.length ){
      return ( <FA name = 'check-square' onClick = { this.applyAxsOnChild.bind(this) } className = 'd-icon'/> );
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
  applyAxsOnChild(){
    let { mods } = this.props;
    this.props.applyAxsOnChild(mods);
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


class PersonalInformationBlk extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'first_name' : '',
      'middle_name' : '',
      'last_name' : '',
      'suffix' : '',
      'marital_status' : ''
    }
  }
  componentDidMount(){
    let { person_personal_info } = this.props;
    let { first_name, middle_name, last_name, suffix, marital_status } = person_personal_info;
    this.setState({
      'first_name' : first_name,
      'middle_name' : middle_name,
      'last_name' : last_name,
      'suffix' : suffix,
      'marital_status' : marital_status
    })
  }
  constructFullName(){
    let { first_name, middle_name, last_name, suffix } = this.state;
    return first_name + ' ' + middle_name + ' ' + last_name + ' ' + suffix;
  }
  render(){
    let fullname = this.constructFullName();
    let { marital_status } = this.state;

    return(
      <div>
        <div>
          <label>Full name : </label><span>{ fullname }</span>
        </div>
        <div>
          <label>Gender : </label><span> {marital_status} </span>
        </div>
      </div>
    )
  }
}


// <span className = 'axs-desc'> { _lbl } <FA className = 'edt-axs' name = 'edit'/> <FA className = 'do-all-axs' name = 'check-square'/> </span>








/*
// these code is only good for lvl 3 tree
class AppModuleTree extends React.Component{
  constructor(props){
    super(props);
  }
  constructGroupAccessList(group){
    return group.childNodes.map((item,idx)=>{
      return (
        <li key = { idx }>{ item.description }</li>
      )
    })
  }
  constructGroup(){
    let { modules } = this.props;
    return modules.map((item,idx)=>{
      let _list = this.constructGroupAccessList( item );
      return (
        <div className = 'grp' key = { idx }>
          <div>{ item.description }</div>
          <ul>{ _list }</ul>
        </div>
      )
    })
  }
  checkIfHaveAccess( mod ){
    let { mod_ids } = this.props;
    if( mod_ids.indexOf(  mod.id ) >= 0 ){
      return true;
    }
    return false;
  }
  constructIcon( mods ){
    let { person_app_module_ids } = this.props;
    if( person_app_module_ids.indexOf( mods.id ) >= 0 ){
      return ( <FA name = 'check'/> );
    }else{
      return ( <FA name = 'remove'/> );
    }
  }
  childListLvl3(parent){
    let _child = parent.childNodes;
    return _child.map((item,idx)=>{
      let icon = this.constructIcon(item);
      return (
        <li key = { idx }> 
          {icon} { item.description } 
        </li>
      )
    })
  }
  childListLvl2( parent ){
    let _arr = [];
    let _child = parent.childNodes;
    if( _child.length ){
      _child.forEach((item,idx)=>{
        let lvl3 = '';
        let icon = this.constructIcon(item);
        if( item.childNodes.length ){
          lvl3 = (
            <ul>
              { this.childListLvl3(item) }
            </ul>
          )
        }
        _arr.push(
          <li key = { idx }>
            { icon } {item.description} {lvl3}
          </li>);
      })
    }
    return _arr;
  }
  // lvl1 is the most parent which is the header
  constructGroupTreeLvl(){
    let { all_mods } = this.props;
    let _arr = [];
    for( let key in all_mods ){
      let icon = this.constructIcon(all_mods[key]);
      _arr.push(
        <li key = { key }>
          {icon} {all_mods[key].description}
          <ul>
            { this.childListLvl2(all_mods[key]) }
          </ul>
        </li> );
    }
    return _arr;
  }
  render(){
    let {isEditing} = this.props;
    let content2 = this.constructGroupTreeLvl();
    return(
      <div className = 'blk'>
        <h4 className = 'hdr'>Modules</h4>
        <div className = 'acs-lvl-tree'>
          <ul>{ content2 }</ul>
        </div>
      </div>
    )
  }
}
*/

/*
            <div className = 'mods'>
              <div className = 'mods-type'>C</div>
              <div className ='hdr'>Main</div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Party</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Party type</li>
                    <li>Contact type</li>
                    <li>Contact Class</li>
                    <li>Address type</li>
                    <li>Person</li>
                    <li>Relationship</li>
                    <li>Roletype</li>
                  </ul>
                </div>
              </div>
              <SubMods/>
              
            </div>
            <div className = 'mods'>
              <div className ='hdr'>Documents</div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Sales</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Sales Invoice</li>
                    <li>Sales Order</li>
                  </ul>
                </div>
              </div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Order</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Sales Order</li>
                    <li>Purchase Order</li>
                  </ul>
                </div>
              </div>
              
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Sales</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Sales Invoice</li>
                    <li>Sales Order</li>
                  </ul>
                </div>
              </div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Sales</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Sales Invoice</li>
                    <li>Sales Order</li>
                  </ul>
                </div>
              </div>
            </div>

*/

/*
        <div className = { _c }>
          <div className = 'editing-hdr' style = { ({ display : isEditing ? 'block' : 'none' })}>
            <div className = 'edit-status' >Editing</div>
            <div><input type = 'checkbox' checked = { isCustom } onChange = { this.toggleCustom.bind(this) }/> Custom</div>
          </div>
          <PersonGroup person_group_ids = { _person_group_ids } all_groups = { _all_groups } loadDefnOfGroup = { this.loadDefnOfGroup.bind(this) }/>
          <PersonGroupAccess all_group_access = { _all_group_access } person_group_access_ids = { _person_group_access_ids } />
          <AccessDefinitionTable  />
          <AppModuleTree all_mods = { _mod_tree } person_app_module_ids = { _person_app_module_ids } />

          <div className = 'blk-r pt-10'>
            <button onClick = { this.toggleEdit.bind(this) }>
              <FA name = 'edit' className = 'axs-icon'/> Edit
            </button>
          </div>
        </div>
*/

/*

class PersonGroup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value : ''
    }
  }
  createIcon(group){
    let { person_group_ids } = this.props;
    if( person_group_ids.indexOf( group.id ) >= 0 ){
      return ( <FA name = 'check'/> );
    }else{
      return ( <FA name = 'remove'/> )
    }
  }
  constructGroupList(){
    let { all_groups, person_group_ids, isEditing } = this.props;
    let _arr = [];
    // console.log(person_group_ids, );
    all_groups.forEach( ( item, idx )=>{
      let icon = this.createIcon(item);
      _arr.push(
        <li key = {idx}>
          {icon} {item.description}
          <span onClick = { this.props.loadDefnOfGroup.bind(this,item.id) }> Load </span>
        </li>);
    })
    return _arr;
  }
  render(){
    let { isEditing } = this.props;
    let content = this.constructGroupList();
    if( isEditing ){
      
    }
    return(
      <div className = 'blk'>
        <h4 className = 'hdr'>Group</h4>
        <div className = 'content'>
          <ul>{content}</ul>
        </div>
      </div>
    )
  }
}
class PersonGroupAccess extends React.Component{
  constructor(props){
    super(props);
  }
  constructIcon(item){
    let { person_group_access_ids } = this.props;
    if( person_group_access_ids.indexOf( item.id ) >= 0 ){
      return ( <FA name = 'check'/> );
    }else{
      return ( <FA name = 'remove'/> );
    }
  }
  constructGroupAccess(){
    let _arr = [];
    let { all_group_access } = this.props;
    all_group_access.forEach((item,idx)=>{
      let icon = this.constructIcon( item );
      _arr.push(<li key = {idx}>{icon} {item.description}</li>)
    })
    return _arr;
  }
  render(){
    let { isEditing } = this.props;
    let content = this.constructGroupAccess();
    
    return(
      <div className = 'blk'>
          <h4 className = 'hdr'>Group Access</h4>
          <div className = 'content'>
            <ul>{content}</ul>
          </div>
        </div>
    )
  }
}

class AccessDefinitionTable extends React.Component{
  constructor(props){
    super(props);
    // group_access_definition
  }
  
  constructContent(){
    let { group_access_definition, all_axs_def, axs_ids } = this.props;
    let _arr = [];
    return _arr;
  }
  render(){
    let { group_access_definition } = this.props;
    let content = this.constructContent();
    
    return(
      <div className = 'blk'>
        <h4 className = 'hdr'>Access Definition</h4>
        <div className = 'cotent axs-dfn'>
          { content }
        </div>
      </div>
    )
  }
}
class Cards extends React.Component{
  render(){
    return(
      <div>
        <div className = 'axs-lvl-card'>
          <div className = 'axs-block'>
            <Mods/>
            <Mods/>
          </div>
          <div className = 'axs-block'>
            <div className = 'mods'>
              <div className ='hdr'>Main</div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Party</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Party type</li>
                    <li>Contact type</li>
                    <li>Contact Class</li>
                    <li>Address type</li>
                    <li>Person</li>
                    <li>Relationship</li>
                    <li>Roletype</li>
                  </ul>
                </div>
              </div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Product</div>
                <div className = 'sub-mods-child-list'>
                  
                </div>
              </div>
              <div className = 'div-breaker'></div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Product</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Party type</li>
                    <li>Contact type</li>
                    <li>Contact Class</li>
                    <li>Address type</li>
                    <li>Person</li>
                    <li>Relationship</li>
                    <li>Roletype</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className = 'mods'>
              <div className ='hdr'>Main</div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Party</div>
                <div className = 'sub-mods-child-list'>
                  <ul>
                    <li>Party type</li>
                    <li>Contact type</li>
                    <li>Contact Class</li>
                    <li>Address type</li>
                    <li>Person</li>
                    <li>Relationship</li>
                    <li>Roletype</li>
                  </ul>
                </div>
              </div>
              <div className = 'sub-mods'>
                <div className = 'sub-mods-hdr'>Product</div>
                <div className = 'sub-mods-child-list'>
                  
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
    )
  }
}
class Mods extends React.Component{
  render(){
    return(
      <div className = 'mods'>
        <div className = 'mods-type'>C</div>
        <div className ='hdr'>Main</div>
        <SubMods/>
        <SubMods/>
      </div>
    )
  }
}
class SubMods extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      moreIsVisible : false,
    }
  }
  toggleMoreVisibility(){
    let { moreIsVisible } = this.state;
    this.setState( { moreIsVisible : !moreIsVisible } )
  }
  render(){
    let { moreIsVisible } = this.state;
    let more_axs_style = {
      display : moreIsVisible ? 'block' : 'none'
    }
    return(
      <div className = 'sub-mods'>
        <div className = 'sub-mods-hdr'>
          <FA name = 'check-square-o'/> Product
        </div>
        <div className = 'sub-mods-child-list'>
          <ul>
            <li><FA name = 'circle-o'/> Party type</li>
            <li><FA name = 'circle'/> Contact type</li>
            <li><FA name = 'circle'/> Contact Class</li>
            <li><FA name = 'circle'/> Address type</li>
            <li><FA name = 'circle'/> Person</li>
            <li><FA name = 'circle'/> Relationship</li>
            <li><FA name = 'circle'/> Roletype</li>
          </ul>
        </div>
        <div className = 'sub-mods-footer'>
          <div className = 'd-axs'>
            <div className = 'edit-icon' onClick = { this.toggleMoreVisibility.bind(this) }>
              <FA name = 'edit'/>
            </div>
            <label>Access:</label>
            <span> Post Only </span>
            <div className = 'more-axs' style = { more_axs_style }>
              <ul>
                <li>View and Post</li>
                <li>View, Edit, Add, Delete, Post, Cancel</li>
                <li>Post Only</li>
                <li>View, Delete</li>
                <li>View, Add</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
*/

/*
<table>
            <thead>
              <tr>
                <th> ID </th>
                <th> Module name </th>
                <th> Url </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> 2 </td>
                <td> Documents </td>
                <td>documents</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Security</td>
                <td>security</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Accounting</td>
                <td>accounting</td>
              </tr>
            </tbody>
          </table>
*/