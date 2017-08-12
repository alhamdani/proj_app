import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class TreeNavAccess{
  @observable _headers = [];
  @observable _navs = [];
  @observable _header_tree = {};
  @observable _isLoaded = false;
  // object currently using
  @observable _treeStrucArr = [];
  @observable _treeStrucObj = {};

  @observable selectedEmp = '';

  @computed get allNav(){
    return axios.get('getallnavaccess');
  }
  @computed get allHeader(){
    return axios.get('getallheadersaccess');
  }
  @action setHeaders(header_list, access_list ){
    // console.log(access_list)
    let isSelected = false;
    header_list.forEach(function(el){el.isSelected = false});
    this._headers = header_list;
  }
  @action setNavs(nav_list, access_list ){
    // console.log(access_list)
    let isSelected = false;
    nav_list.forEach(function(el){el.isSelected = false;});
    this._navs = nav_list;
  }
  @action addChildOnNode(){
    console.log('adding darling')
  }
  @action treeBuild(){
    let { _navs, _headers } = this;
    let _obj = {};
    let _arr = [];
    _headers.forEach(function(el){
      el.childList = [];
      _obj[ el.id ] = el;
    });
    _navs.forEach(function(el){
      _obj[ el.header_id ].childList.push(el);
    });
    for( let key in _obj ){
      _obj[ key ].childNodes = this.childTreeStruc( _obj[key].childList );
      _arr.push(_obj[ key ]);
    }
    this._treeStrucObj = _obj;
    this._treeStrucArr = _arr;
  }
  childTreeStruc( childNodes ){
    let _obj = {};
    let _treeStruc = [];
    childNodes.forEach(function(el){
      el.childNodes = [];
      _obj[ el.id ] = el;
    });
    childNodes.forEach(function(el){
      if( el.parent_id !== 0 ){
        _obj[ el.parent_id ].childNodes.push(el);
      }else{
        _treeStruc.push( el );
      }
    });
    return _treeStruc;
  }
  @action updateStatus(node){
    console.log(this._treeStrucArr)
  }
  @action addEditNode( node, isEdit, isHeader, new_values ){
    let { _treeStrucArr } = this;
    let baseId = isHeader ? 'id' : 'header_id';
    let idx = '';
    this._isLoaded = false;
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      if( _treeStrucArr[x].id == node[ baseId ] ){
        idx = x;
        break;
      }
    }
    console.log('parent', _treeStrucArr[idx]);
    let foundNode = this.findNodeLocation(node, _treeStrucArr[idx]);
    // console.log(idx);
    // console.log(isEdit, new_values, foundNode);
    if( isEdit ){
      foundNode.name = new_values['name'];
      foundNode.url = new_values['url'];
      foundNode.order = new_values['order'];
      foundNode.name = new_value;
      // this._isLoaded = true;
    }else{
      let _q = {};
      _q.childList = [];
      _q.childNodes = [];
      _q.id = 1;
      _q.isSelected = false;
      _q.name = new_values['name'];
      _q.order = new_values['order'];
      _q.url = new_values['url'];
      if( !isHeader ){
        _q.header_id = foundNode['header_id'];
      }else{
        _q.header_id = foundNode['id'];
      }
      _q.parent_id = foundNode[ baseId ];

      if( foundNode.childList == undefined ){
        foundNode.childList = [];
      }
      if( foundNode.childNodes == undefined ){
        foundNode.childNodes = [];
      }
      foundNode.childList.push(_q);
      foundNode.childNodes.push(_q);

      // axios.post('add')

      // childNodes
      // console.log(foundNode.childList.push());
      this._isLoaded = true;
      // console.log('Adding child node on ',isEdit, node.name, isHeader);
    }
  }
  checkAccess(){

  }
  groupUserAccess( access_list ){
    let temp_obj = {};
    for( let x = 0; x < access_list.length; x++ ){
      let _w = access_list[x];
      if( temp_obj[ _w.parentHeaderId ] == undefined ){
        temp_obj[ _w.parentHeaderId ] = _w;
        temp_obj[ _w.parentHeaderId ].childNodes = [];
      }
      temp_obj[ _w.parentHeaderId ].childNodes.push( _w );
    }
    return temp_obj;
  }
  traverseChildNodeAndConstruct( node, isHeader, groupedAccess ){
    if( isHeader ){
      if( groupedAccess[ node.id ] !== undefined ){
        node.isSelected = true;
      }else{
        node.isSelected = false;
      }
    }else{
      let _w = groupedAccess[ node.header_id ];
      if( _w !== undefined ){
        let _e = _w.childNodes;
        // loop through the children
        node.isSelected = false; // set default value
        for( let x = 0; x < _e.length; x++ ){
          if( _e[x].id == node.id ){
            node.isSelected = true;
            node.access_code = _e[x].access_code;
            break;
          }
        }
      }
    }
    let _children = node.childNodes;
    if( _children.length ){
      for( let x = 0; x < _children.length; x++ ){
        this.traverseChildNodeAndConstruct( _children[ x ], false, groupedAccess );
      }
    }
  }
  updateAccessStatus( node, trans ){
    let access_code = node.access_code == undefined ? '' : node.access_code;
    this._isLoaded = false;
    
    let idx = access_code.indexOf(trans);
    
    if( idx >= 0 ) access_code = access_code.replace(trans, '');
    else access_code = access_code + trans;

    node.access_code = access_code;
    this._isLoaded = true;
  }
  resetTreeValues(){
    let { _treeStrucArr } = this;
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      this.traverseChildNodeAndUpdate( _treeStrucArr[ x ].childNodes, false, '' );
    }
  }
  traverseChildNodeAndUpdate( node, isSelected, access_code ){
    for( let x = 0; x < node.length; x++ ){
      node[x].isSelected = isSelected;
      if( access_code !== undefined ){
        node[x].access_code = access_code;
      }
      if( node[x].childNodes.length ){
        this.traverseChildNodeAndUpdate( node[x].childNodes, isSelected );
      }
    }
  }
  traverseChildNodeAndStore( nodes, temp_arr ){
    for( let x = 0; x < nodes.length; x++ ){
      // console.log(nodes[x].isSelected, nodes[x].name)
      if( nodes[x].isSelected ){
        temp_arr.push( { 'access_id' : nodes[x].id, 'trans' : nodes[x].access_code } );
      }
      if( nodes[x].childNodes.length ){
        this.traverseChildNodeAndStore( nodes[x].childNodes, temp_arr );
      }
    }
  }

  findNodeLocation( nodeToSearch, node ){
    // console.log(' - - - - - - > ',node)
    let _children = node.childNodes;
    let result = {};
    if( nodeToSearch.name == node.name ){
      return node;
    }else{
      if( _children.length ){
        for( let x = 0; x < _children.length; x++ ){
          result = this.findNodeLocation( nodeToSearch, _children[x] );
          if( result.name !== undefined ){
            return result;
          }
        }
      }
    }
    return result;
  }

  getAllSelectedAccess(){
    let { _treeStrucArr, selectedEmp } = this;
    let temp_arr = [];
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      this.traverseChildNodeAndStore( _treeStrucArr[ x ].childNodes, temp_arr);
    }
    axios.post('updateempaccess/', { 'access' : temp_arr, 'emp' : selectedEmp } )
      .then(function(rs){
        console.log('okay', rs);
      })
  }
  updateEmployeeAccess(){
    this.getAllSelectedAccess();
  }
  @action updateStatusAndChildNodes( node, isHeader ){
    this._isLoaded = false;
    let { _treeStrucArr } = this;
    let _compareId = '';
    let idx = '';
    let baseId = isHeader ? 'id' : 'header_id';
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      if( _treeStrucArr[x].id == node[ baseId ] ){
        idx = x;
        break;
      }
    }
    if( isHeader ){
      let { isSelected } = _treeStrucArr[ idx ];
      _treeStrucArr[ idx ].isSelected = !isSelected;
      this.traverseChildNodeAndUpdate( _treeStrucArr[ idx ].childNodes, !isSelected );
      // this._treeStrucArr = _treeStrucArr;
      this._isLoaded = true;
    }else{
      let header_id = node.header_id;
      let foundNode = this.findNodeLocation( node, _treeStrucArr[ idx ] );
      let { isSelected } = foundNode;
      if( !isSelected ){
        // we can put here the code to update the parent if the element is selected
      }
      foundNode.isSelected = !isSelected;
      this.traverseChildNodeAndUpdate( foundNode.childNodes, !isSelected ); // update child status
      this._isLoaded = true;
    }
  }
  @action updateTreeStruc( emp ){
    this._isLoaded = false;
    axios.get('getuseraccess/', { params : { 'emp_id' : emp.id } }).then(function(rs){
        let data = rs.data.qs;
        this.selectedEmp = emp;
        let { _treeStrucArr } = this;
        let groupedAccess = this.groupUserAccess( data );
        for( let x = 0; x < _treeStrucArr.length; x++ ){
          this.traverseChildNodeAndConstruct( _treeStrucArr[ x ], true, groupedAccess );
        }
        // console.log(_treeStrucArr);
        this._isLoaded = true;
        this._treeStrucArr = _treeStrucArr;
        // console.log(data);
      }.bind(this) )
  }

/*
 ---- june 2, 2017
 @observable _headers = [];
  @observable _navs = [];
  @observable _header_tree = {};
  @observable _isLoaded = false;
  // object currently using
  @observable _treeStrucArr = [];
  @observable _treeStrucObj = {};

  @observable selectedEmp = '';

  @observable isEditMode = false;

  @computed get allNav(){
    return axios.get('getallnavaccess');
  }
  @computed get allHeader(){
    return axios.get('getallheadersaccess');
  }
  @action setHeaders(header_list, access_list ){
    // console.log(access_list)
    let isSelected = false;
    header_list.forEach(function(el){el.isSelected = false});
    this._headers = header_list;
  }
  @action setNavs(nav_list, access_list ){
    // console.log(access_list)
    let isSelected = false;
    nav_list.forEach(function(el){el.isSelected = false;});
    this._navs = nav_list;
  }

  @action toggleEditMode(){
    let { isEditMode } = this;
    this.isEditMode = !isEditMode;
  }
  @action addChildOnNode(){
    console.log('adding darling')
  }
  @action treeBuild(){
    let { _navs, _headers } = this;
    let _obj = {};
    let _arr = [];
    _headers.forEach(function(el){
      el.childList = [];
      _obj[ el.id ] = el;
    });
    _navs.forEach(function(el){
      _obj[ el.header_id ].childList.push(el);
    });
    for( let key in _obj ){
      _obj[ key ].childNodes = this.childTreeStruc( _obj[key].childList );
      _arr.push(_obj[ key ]);
    }
    this._treeStrucObj = _obj;
    this._treeStrucArr = _arr;
  }
  childTreeStruc( childNodes ){
    let _obj = {};
    let _treeStruc = [];
    childNodes.forEach(function(el){
      el.childNodes = [];
      _obj[ el.id ] = el;
    });
    childNodes.forEach(function(el){
      if( el.parent_id !== 0 ){
        _obj[ el.parent_id ].childNodes.push(el);
      }else{
        _treeStruc.push( el );
      }
    });
    return _treeStruc;
  }
  @action updateStatus(node){
    console.log(this._treeStrucArr)
  }
  @action addEditNode( node, isEdit, isHeader, new_values ){
    let { _treeStrucArr } = this;
    let baseId = isHeader ? 'id' : 'header_id';
    let idx = '';
    this._isLoaded = false;
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      if( _treeStrucArr[x].id == node[ baseId ] ){
        idx = x;
        break;
      }
    }
    console.log('parent', _treeStrucArr[idx]);
    let foundNode = this.findNodeLocation(node, _treeStrucArr[idx]);
    // console.log(idx);
    // console.log(isEdit, new_values, foundNode);
    if( isEdit ){
      foundNode.name = new_values['name'];
      foundNode.url = new_values['url'];
      foundNode.order = new_values['order'];
      foundNode.name = new_value;
      // this._isLoaded = true;
    }else{
      let _q = {};
      _q.childList = [];
      _q.childNodes = [];
      _q.id = 1;
      _q.isSelected = false;
      _q.name = new_values['name'];
      _q.order = new_values['order'];
      _q.url = new_values['url'];
      if( !isHeader ){
        _q.header_id = foundNode['header_id'];
      }else{
        _q.header_id = foundNode['id'];
      }
      _q.parent_id = foundNode[ baseId ];

      if( foundNode.childList == undefined ){
        foundNode.childList = [];
      }
      if( foundNode.childNodes == undefined ){
        foundNode.childNodes = [];
      }
      foundNode.childList.push(_q);
      foundNode.childNodes.push(_q);

      // axios.post('add')

      // childNodes
      // console.log(foundNode.childList.push());
      this._isLoaded = true;
      // console.log('Adding child node on ',isEdit, node.name, isHeader);
    }
  }
  checkAccess(){

  }
  groupUserAccess( access_list ){
    let temp_obj = {};
    for( let x = 0; x < access_list.length; x++ ){
      let _w = access_list[x];
      if( temp_obj[ _w.parentHeaderId ] == undefined ){
        temp_obj[ _w.parentHeaderId ] = _w;
        temp_obj[ _w.parentHeaderId ].childNodes = [];
      }
      temp_obj[ _w.parentHeaderId ].childNodes.push( _w );
    }
    return temp_obj;
  }
  traverseChildNodeAndConstruct( node, isHeader, groupedAccess ){
    if( isHeader ){
      if( groupedAccess[ node.id ] !== undefined ){
        node.isSelected = true;
      }else{
        node.isSelected = false;
      }
    }else{
      let _w = groupedAccess[ node.header_id ];
      if( _w !== undefined ){
        let _e = _w.childNodes;
        // loop through the children
        node.isSelected = false; // set default value
        for( let x = 0; x < _e.length; x++ ){
          if( _e[x].id == node.id ){
            node.isSelected = true;
            node.access_code = _e[x].access_code;
            break;
          }
        }
      }
    }
    let _children = node.childNodes;
    if( _children.length ){
      for( let x = 0; x < _children.length; x++ ){
        this.traverseChildNodeAndConstruct( _children[ x ], false, groupedAccess );
      }
    }
  }
  updateAccessStatus( node, trans ){
    let access_code = node.access_code == undefined ? '' : node.access_code;
    this._isLoaded = false;
    
    let idx = access_code.indexOf(trans);
    
    if( idx >= 0 ) access_code = access_code.replace(trans, '');
    else access_code = access_code + trans;

    node.access_code = access_code;
    this._isLoaded = true;
  }
  resetTreeValues(){
    let { _treeStrucArr } = this;
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      this.traverseChildNodeAndUpdate( _treeStrucArr[ x ].childNodes, false, '' );
    }
  }
  traverseChildNodeAndUpdate( node, isSelected, access_code ){
    for( let x = 0; x < node.length; x++ ){
      node[x].isSelected = isSelected;
      if( access_code !== undefined ){
        node[x].access_code = access_code;
      }
      if( node[x].childNodes.length ){
        this.traverseChildNodeAndUpdate( node[x].childNodes, isSelected );
      }
    }
  }
  traverseChildNodeAndStore( nodes, temp_arr ){
    for( let x = 0; x < nodes.length; x++ ){
      // console.log(nodes[x].isSelected, nodes[x].name)
      if( nodes[x].isSelected ){
        temp_arr.push( { 'access_id' : nodes[x].id, 'trans' : nodes[x].access_code } );
      }
      if( nodes[x].childNodes.length ){
        this.traverseChildNodeAndStore( nodes[x].childNodes, temp_arr );
      }
    }
  }

  findNodeLocation( nodeToSearch, node ){
    // console.log(' - - - - - - > ',node)
    let _children = node.childNodes;
    let result = {};
    if( nodeToSearch.name == node.name ){
      return node;
    }else{
      if( _children.length ){
        for( let x = 0; x < _children.length; x++ ){
          result = this.findNodeLocation( nodeToSearch, _children[x] );
          if( result.name !== undefined ){
            return result;
          }
        }
      }
    }
    return result;
  }

  getAllSelectedAccess(){
    let { _treeStrucArr, selectedEmp } = this;
    let temp_arr = [];
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      this.traverseChildNodeAndStore( _treeStrucArr[ x ].childNodes, temp_arr);
    }
    axios.post('updateempaccess/', { 'access' : temp_arr, 'emp' : selectedEmp } )
      .then(function(rs){
        console.log('okay', rs);
      })
  }
  updateEmployeeAccess(){
    this.getAllSelectedAccess();
  }
  @action updateStatusAndChildNodes( node, isHeader ){
    this._isLoaded = false;
    let { _treeStrucArr } = this;
    let _compareId = '';
    let idx = '';
    let baseId = isHeader ? 'id' : 'header_id';
    for( let x = 0; x < _treeStrucArr.length; x++ ){
      if( _treeStrucArr[x].id == node[ baseId ] ){
        idx = x;
        break;
      }
    }
    if( isHeader ){
      let { isSelected } = _treeStrucArr[ idx ];
      _treeStrucArr[ idx ].isSelected = !isSelected;
      this.traverseChildNodeAndUpdate( _treeStrucArr[ idx ].childNodes, !isSelected );
      // this._treeStrucArr = _treeStrucArr;
      this._isLoaded = true;
    }else{
      let header_id = node.header_id;
      let foundNode = this.findNodeLocation( node, _treeStrucArr[ idx ] );
      let { isSelected } = foundNode;
      if( !isSelected ){
        // we can put here the code to update the parent if the element is selected
      }
      foundNode.isSelected = !isSelected;
      this.traverseChildNodeAndUpdate( foundNode.childNodes, !isSelected ); // update child status
      this._isLoaded = true;
    }
  }
  @action updateTreeStruc( emp ){
    this._isLoaded = false;
    axios.get('getuseraccess/', { params : { 'emp_id' : emp.id } }).then(function(rs){
        let data = rs.data.qs;
        this.selectedEmp = emp;
        let { _treeStrucArr } = this;
        let groupedAccess = this.groupUserAccess( data );
        for( let x = 0; x < _treeStrucArr.length; x++ ){
          this.traverseChildNodeAndConstruct( _treeStrucArr[ x ], true, groupedAccess );
        }
        // console.log(_treeStrucArr);
        this._isLoaded = true;
        this._treeStrucArr = _treeStrucArr;
        // console.log(data);
      }.bind(this) )
  }

  ---- june 2, 2017 
*/

  /*
  headerChild(header){
    let { _navs } = this;
    let temp_arr = [];
    _navs.forEach(function(el){
      if( el.header_id == header.id && el.parent_id == 0 ){
        temp_arr.push(el);
      }
    })
    return temp_arr;
  }
  nodeChild(item){
    let { _navs } = this;
    let temp_arr = [];
    _navs.forEach(function(el){
      if( el.parent_id == item.id ){
        temp_arr.push(el);
      }
    })
    return temp_arr;
  }
  */

  // checkIfHaveAccess( access_list, id ){
  //   for( let x = 0; x < access_list.length; x++ ){
  //     if( access_list[x].id == id ){
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  // @action createTree( access_list = [] ){
  //   let { _headers, _navs } = this;
  //   let _obj = {};
  //   _headers.forEach(function(el){
  //     el.childNodes = [];
  //     el.isSelected = this.checkIfHaveAccess(access_list, el.id);
  //     _obj[ el.id ] = el;
  //   }.bind(this));
  //   _navs.forEach(function(el){
  //     el.isSelected = false;
  //     _obj[ el.header_id ].childNodes.push(el);
  //   }.bind(this) );
  //   for( let key in _obj ){
  //     _obj[ key ].treeStruc = this.childTreeStruc( _obj[key].childNodes );
  //   }
  //   this._header_tree = _obj;
  //   this._isLoaded = true;
  // }
 
  // @action selectHeader( header ){
    
  // }
}
let treeNavAccess = new TreeNavAccess;
export default treeNavAccess;