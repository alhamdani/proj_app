import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class UserAccess{
  @observable nav_access = [];
  /*
  @observable sub_nav_access = [
    { 'id' : 51, 'name' : 'P-1', 'url' : 'p-1', 'parent' : 0, 'parentUrl' : 'party' },
    { 'id' : 52, 'name' : 'P-1-1', 'url' : 'p-1-1', 'parent' : 51, 'parentUrl' : 'party' },
    { 'id' : 53, 'name' : 'P-1-1-1', 'url' : 'p-1-1-1', 'parent' : 52, 'parentUrl' : 'party' },
    { 'id' : 54, 'name' : 'P-1-1-1-1', 'url' : 'p-1-1-1-1', 'parent' : 53, 'parentUrl' : 'party' },

    { 'id' : 726, 'name' : 'List', 'url' : 'party-list', 'parent' : 0, 'parentUrl' : 'party' },
    
    { 'id' : 221, 'name' : 'Person', 'url' : 'person', 'parent' : 0, 'parentUrl' : 'party' },

    { 'id' : 1, 'name' : 'page 1', 'url' : 'page-1', 'parent' : 0 },
    { 'id' : 11, 'name' : 'page 1 - 1', 'url' : 'p-1-1', 'parent' : 1, 'parentUrl' : 'party' },
    { 'id' : 12, 'name' : 'page 1 - 2', 'url' : 'p-1-2', 'parent' : 1, 'parentUrl' : 'party' },
    { 'id' : 121, 'name' : 'page 1 - 2 - 1', 'url' : 'p-1-2-1', 'parent' : 12, 'parentUrl' : 'party' },

    { 'id' : 2, 'name' : 'page 2', 'url' : 'page-2', 'parent' : 0, 'parentUrl' : 'party' },
    { 'id' : 21, 'name' : 'page 2 - 1', 'url' : 'p-2-1', 'parent' : 2, 'parentUrl' : 'party' },

    { 'id' : 3, 'name' : 'page 3', 'url' : 'page-3', 'parent' : 0, 'parentUrl' : 'party' }
  ];
  */
  @observable sub_nav_access = [];
  @observable all_access = {};
  @observable header_nav = {};
  @observable access_key_code = '';

  @observable access_level = {
    'canAdd' : false,
    'canView' : true,
    'canEdit' : false,
    'canDelete' : false
  }

  @observable isUserAccessLoaded = false;

  
  @action AllAccessLvl(){
    
  }
  defineNavHeader(data, isForAccessLevelPage){
    let temp_obj = {};
    data.forEach(function(item){
      // console.log(item);
      if( temp_obj[item.parentHeaderOrder] === undefined ){
        temp_obj[ item.parentHeaderOrder ] = { 
          id : item.parentHeaderId,
          name : item.parentHeaderName.toUpperCase(), 
          url : item.parentHeaderUrl,
          access_code : item.access_code,
          child_nav : []
        };
      }
      let temp_obj2 = {
            name : item.name,
            id : item.id,
            order : item.order,
            parent : item.parent,
            parentHeaderUrl : item.parentHeaderUrl,
            url : item.url,
            access_code : item.access_code
        }
      // console.log('item value', item)
      if( isForAccessLevelPage ){
        temp_obj2.isSelected = item.isSelected;
      }
      temp_obj[ item.parentHeaderOrder ]
        .child_nav.push( temp_obj2 );
    });
    return temp_obj;
  }
  @action setUpNavAccess( data, current_path_header ){
    // console.log('setting up nav on data value', data);
    let arr = [];
    // this.sub_nav_access = data;
    this.all_access = data;
    this.header_nav = this.defineNavHeader(data);
    this.isUserAccessLoaded = true;
    let _w = current_path_header.split('/');
    let _e = this.getParentNavUrl(_w);
    let _q = this.getNavInfo(_e);
    this.updateSideNav(_q);
  }
  @action updateSideNav(nav){
    this.sub_nav_access = nav.child_nav;
    // console.log('----->>>>>>>>>', nav)
  }
  getParentNavUrl(pathArray){
    let _q = '';
    for(let x = 0; x < pathArray.length; x++ ){
      if( pathArray[x] !== '' ){
        _q = pathArray[x];
        break;
      }
    }
    return _q;
  }
  getNavInfo(_q){
    let { header_nav } = this;
    // console.log('header_nav-+++++++++>>>',header_nav)
    let _e = {};
    if( _q !== '' ){
      for( let key in header_nav ){
        // console.log( 'comparing - - - ->', header_nav[key].url, _q )
        if( header_nav[key].url == _q ){
          _e = header_nav[key];
          break;
        }
      }
    }
    // console.log('e value ',_e);
    return _e;
  }
  @action pathAccessLevelKeyCode( path ){
    // console.log(path)
    let _w = path.split('/');
    let _q = '';
    for(let x = 0; x<_w.length; x++ ){
      if( _w[x] !== '' ){
        _q = _w[x];
        break;
      }
    }
    if( _q !== '' ){
      let { header_nav } = this;
      let _e = {};
      for( let key in header_nav ){
        if( header_nav[key].url == _q ){
          _e = header_nav[key];
        }
      }
      let finalUrl = _w[_w.length - 1];
      for(let x = 0; x < _e.child_nav.length; x++){
        if( _e.child_nav[x].url == finalUrl ){
          let _c =  _e.child_nav[x].access_code;
          this.access_level.canAdd = _c.indexOf('c') >= 0 ? true : false;
          this.access_level.canView = _c.indexOf('r') >= 0 ? true : false;
          this.access_level.canEdit = _c.indexOf('u') >= 0 ? true : false;
          this.access_level.canDelete = _c.indexOf('d') >= 0 ? true : false;
          break;
        }
      }
    }
    
  }
  checkAccess( path ){
    // console.log('checking access');
    // console.log(path);
    let _w = path.split('/');
    let parentUrl = this.getParentNavUrl(_w);
    // console.log(parentUrl);
    let navInfo = this.getNavInfo(parentUrl);
    // console.log(navInfo);
    // if it return something
    if( Object.keys( navInfo ).length > 0 ){
      let {child_nav} = navInfo
      let componentUrl = _w[_w.length-1];
      // if current url is the parent or header
      if( navInfo.url == componentUrl ){
        return ( navInfo.access_code );
      }
      // if not parent then go check the child 
      if( child_nav.length > 0 ){
        for( let x = 0; x < child_nav.length; x++ ){
          // console.log(componentUrl, child_nav[x].url)
          if(componentUrl == child_nav[x].url ){
            return child_nav[x].access_code;
            // return true;
          }
        }
      }
    }
    return false;
  }
  getPageTree( nav_arr ){
    // console.log(nav_arr)
    let pg = nav_arr;
    // let pg = nav_arr;
    let pg_copy = [];
    let treeList = [];
    let lookup = {};
    // copy sub_nav_access
    pg.forEach( ( item ) => {
      // pg_copy.push( Object.assign( {}, item ) );
      pg_copy.push( item );
      // console.log('on user access', item)
    });
    // console.log(pg_copy);
    // add childNode on each entry of pg_copy
    pg_copy.forEach(function(obj) {
      obj['childNodes'] = [];
      lookup[ obj[ 'id' ] ] = obj;
    });
    // add the entry on its own child if their is any
    pg_copy.forEach(function(obj) {
      // console.log(obj[ 'parent' ]);
      // console.log(lookup[ obj[ 'parent' ] ] );
      if (obj['parent'] != 0 ) { // if not a parent
        lookup[ obj['parent'] ][ 'childNodes' ].push( obj );
      } else {
        treeList.push(obj);
      }
    });
    return treeList;
  }
  checkAndRedirectIfNone( _this ){
    let path = _this.props.location.pathname
    let code = this.checkAccess(path);
    if( code == '' ){
      this.props.router.replace('error');
    }else{
      this.access_key_code = code;
    }
  }
}
let userAccess = new UserAccess;
export default userAccess;