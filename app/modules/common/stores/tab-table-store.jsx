import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class TabTableStore{
  // changes are here
  @observable page_from = 0;
  @observable page_to = 5;
  @observable max_page = 0;
  @observable current_page = 1;
  @observable limit = 5;
  @observable all_count = 0; // count all the list on the database
  @observable counted_list = 0; // count the current_list on the page
  @observable queriedAll = false;
  @observable select_all = false;
  @observable list_of_obj = [];
  cached_obj = {};
  @observable searchKey = '';
  @observable prevData = {};

  cached_data = {};

  @observable givenUrls = {};
  @observable isUrlSetup = false;

  @observable isObjInfoLoaded = false;

  @observable usePkColumn = 'id';

  @observable fieldsOnEditAndAdd = [];

  @observable filterFields = [];
  @observable isHeadersSet = false;

  @observable selectedItemCounter = 0;

  @action setUpUrls( 
      allObjWithSomeInfoUrl, 
        allObjWithAllInfoUrl, 
          allObjCountUrl, 
            saveNewInfoUrl, 
              getObjInfoUrl,
                saveNewEntryUrl,
                  deleteEntryUrl,
                    searchEntryUrl ){
    let temp_obj = {};
    temp_obj['allObjWithSomeInfo'] = allObjWithSomeInfoUrl;
    temp_obj['allObjWithAllInfo'] = allObjWithAllInfoUrl;
    temp_obj['allObjCount'] = allObjCountUrl;
    temp_obj['saveNewInfo'] = saveNewInfoUrl;
    temp_obj['getObjInfo'] = getObjInfoUrl;
    temp_obj['saveNewEntry'] = saveNewEntryUrl;
    temp_obj['deleteEntry'] = deleteEntryUrl;
    temp_obj['searchEntry'] = searchEntryUrl;
    this.givenUrls = temp_obj;
    this.isUrlSetup = true;
  }
  @action setFilterFields(arr){
    this.filterFields = arr;
    this.isHeadersSet = true;
  }
  @action sortObjBySelected(){
    this.filterFields.forEach(function(item){
      console.log(item.useToSort);
    })
  }
  @action getAddEditFields(){
    let { getFields } = this.givenUrls;
    axios.get()
      .then(function(rs){
        console.log(rs);
      })
  }
  @action updateObjFilter(item){
    let {useToFilter} = item;
    item.useToFilter = !useToFilter;
  }
  @action filterObjOnSelected(){
    // this.updateObj();
  }
  @action checkSelectedChanges(){
    let { list_of_obj } = this;
    let counter = 0, count_list = list_of_obj.length;
    list_of_obj.forEach(function(rs){
      if( rs.selected ){
        counter += 1;
      }
    });
    if( counter === count_list ){
      this.select_all = true;
    }else{
      this.select_all = false;
    }
    this.selectedItemCounter = counter;
  }
  @action toggleSelectAll(){
    let _select_all = this.select_all;
    this.select_all = !_select_all;
  } 
  @action goToList( value ){
    let { limit, max_page, searchKey } = this;
    value = parseInt(value);
    max_page = parseInt(max_page);
    if( value > 0 && value <= max_page ){
      limit = parseInt(limit);
      this.current_page = value;
      this.page_from = ( value - 1 ) * limit;
      this.page_to = value * limit;
      if( searchKey !== '' ){
        this.updateSearchObj('goto');
      }else{
        this.updateObjList();
      }
    }
  }
  @action nextList(){
    let { max_page, current_page } = this;
    if( current_page < max_page ){
      let { limit, page_from, page_to, searchKey, current_page } = this; // get the partial value
      this.current_page += 1;
      let currentKeyCode = page_from+'_'+page_to;
      this.cached_obj[currentKeyCode] = this.list_of_obj;// update the cached list_of_obj before updating
      // udpate the value
      limit =  parseInt(limit);
      current_page = parseInt(current_page);
      this.page_from = current_page * limit; 
      this.page_to = ( current_page + 1 ) * limit;
      this.select_all = false;
      this.updateObj();
    }
  }
  @action prevList(){
    let { current_page, searchKey } = this;
    if( parseInt( current_page ) > 1 ){
      this.current_page -= 1;
      let { limit, page_from, page_to, searchKey, current_page } = this;
      let currentKeyCode = page_from+'_'+page_to;
      this.cached_obj[currentKeyCode] = this.list_of_obj; // update the cached list_of_obj before updating
      limit = parseInt(limit);
      page_from = parseInt( page_from );
      current_page = parseInt(current_page);
      this.page_from = ( current_page - 1 ) * limit;
      this.page_to = ( current_page ) * limit;
      this.updateObj();
    }
  }
  @action deleteSelectedObj(){
    let { cached_data } = this;
    let { list_of_obj } = this;
    let { deleteEntry } = this.givenUrls;
    let to_del = [];
    for( let key in cached_data ){
      if( cached_data[key].selected ){
        to_del.push(cached_data[key].id);
      }
    }
    list_of_obj.forEach((item)=>{
      if( item.selected){
        if( to_del.indexOf(item.id) < 0 ){
          to_del.push(item.id);
        }
      }
    })
    axios.post(deleteEntry, { 'ids' : to_del } )
      .then(function(rs){
        this.updateObj();
      }.bind(this))
  }
  @action changeLimit( value ){
    let { page_from, page_to, all_count } = this;
    let current_keyCode = page_from+'_'+page_to;

    this.cached_obj = {}; // clear the cached

    value = parseInt(value);
    page_from = parseInt(page_from)
    all_count = parseInt(all_count)


    let _page_to = page_from + value;

    this.limit = value;
    this.page_from = 0;
    this.page_to = value;
    this.current_page = 1;
    let _max_page =  Math.ceil( all_count / value );
    this.max_page = _max_page;
    this.cached_obj = {};
    if( this.searchKey !== '' ){
      this.updateSearchObj('lmit');
    }else{
      this.updateObjList();
    }
  }
  copyCachedAndUpdate( data ){
    let _counted = data.length;
    this.select_all = false; 
    // copy the previous value of the list_of_obj
    this.list_of_obj.forEach( (item) => { this.cached_data[ item.id ] = item; });
    let _toSelectCounter = 0;
    data.forEach( ( item ) => { 
      // if found on cached
      if( this.cached_data[item.id] !== undefined ){
        item.selected = this.cached_data[ item.id ].selected;
        // if previous value is true
        if( this.cached_data[ item.id ].selected ){  _toSelectCounter += 1; }
      }
    });
    // console.log(_toSelectCounter, _counted )
    // if all the entry on the list is selected
    if( _toSelectCounter === _counted ){ 
      this.select_all = true; 
    }
    this.list_of_obj = data;
    // this.counted_list = _counted;
  }
  // only works if search input is activated
  @action updateSearchObj(_t){
    let value = this.searchKey;
    let { searchEntry } = this.givenUrls;
    let { page_from, page_to } = this;
    let _from = page_from, _to = page_to;
    let keyCode = _from + '_' + _to;
    let _orders = this.getObjOrders();
    let filterColumns = this.getObjFilters();
    
    axios.get( searchEntry, { 'params' : 
      { 
        'search_for' : value, 
        '_from' : _from, '_to' : _to, 
        'columns' : filterColumns, 'orders' : _orders } })
      .then(function(rs){
        this.copyCachedAndUpdate( rs.data.qs )
      }.bind(this))
  }
  @action updateObj(){
    let { searchKey } = this;
    if( searchKey !== '' ){
      this.updateSearchObj('prev');
    }else{
      this.updateObjList();
    }
  }
  getObjFilters(){
    let filterColumns = [];
    this.filterFields.forEach(function(item){
      if( item.useToFilter ){
        filterColumns.push(item.name)
      }
    });
    return filterColumns;
  }
  // only run on search first run
  @action searchOnObj( value ){
    let { limit, page_from, page_to } = this;
    let { searchEntry } = this.givenUrls;
    let keyCode = page_from+'_'+page_to;
    let filterColumns = this.getObjFilters();
    let _orders = this.getObjOrders();
    if( value.length >= 2 ){
      axios.get( searchEntry, 
        { 'params' : 
          { 
            'search_for' : value, 
            '_from' : 0, '_to' : limit, 
            'columns' : filterColumns, 'orders' : _orders } } )
        .then(function(rs){
            let { counted } = rs.data; 
            counted = parseInt( counted );
            rs.data.qs.forEach((item) => { item.selected = false; });
            this.max_page =  Math.ceil( counted /parseInt( limit ) );
            if( counted === 0 ){ // if no result found
              this.page_from = 0;
              this.page_to = 0;
              this.current_page = 0;
            }else{
              this.current_page = 1;
              this.page_from = 0; 
              let _page_to = limit <= counted ? limit : counted; // 0 to the limit e.g. 0 - 10
              this.page_to = _page_to; 
            }
            
            this.list_of_obj = rs.data.qs;
            this.all_count = counted;
            
            // this.cached_obj = {}; // clear the data
            // this.cached_obj[ keyCode ] = rs.data.qs;
            this.searchKey = value;
          }.bind(this))
    }
  }
  @action updateFilterFieldSort( item ){
    let { useToSortKey, name } = item;
    this.filterFields.forEach((itm) => {
      if( itm.name === name ){
        if( useToSortKey === 2 ){
          itm.useToSortKey = 0;
        }else{
          itm.useToSortKey = useToSortKey + 1;
        }
      }else{
        itm.useToSortKey = 0;
      }
    });
  }
  getObjOrders(){
    let _orders = [];
    this.filterFields.forEach(function(item){
      let { useToSortKey } = item;
      if( useToSortKey ){
        if( useToSortKey == 1 ){
          _orders.push('-'+item.name);
        }else if ( useToSortKey == 2 ){
          _orders.push(item.name);
        }
      }
    });
    return _orders;
  }
  @action updateObjList(){
    
    let { allObjWithSomeInfo } = this.givenUrls;
    let _from = this.page_from;
    let _to = this.page_to;
    let keyCode = _from+'_'+_to;

    let _orders = this.getObjOrders();

    axios.get(allObjWithSomeInfo, { 'params' : { '_from' : _from, '_to' : _to, 'orders' : _orders } } )
      .then(function(rs){
        // console.log(rs.data.qs)
        this.copyCachedAndUpdate(rs.data.qs);
      }.bind(this))
  }
  @action toggleSelected(idx){
    
  }
  @action resetToDefaultValues(){
    this.page_from = 0;
    this.page_to = 5;
    this.max_page = 0;
    this.current_page = 1;
    this.all_count = 0;
    this.counted_list = 0;
    this.queriedAll = false;
    this.select_all = false;
    this.list_of_obj = [];
    this.searchKey = '';
  }
  objInfo( id ){
    let { getObjInfo } = this.givenUrls;
    this.isObjInfoLoaded = false;
    axios.get( getObjInfo, { 'params' : { 'id' : id } } )
      .then(function(rs){ 
        this.isObjInfoLoaded = true;
        return rs.data.qs;
      }.bind(this));
  }
  
  // this will only call on firstload or reset is clicked
  @action getObjList(){
    let { allObjCount, allObjWithSomeInfo } = this.givenUrls;
    let { page_from, page_to, limit } = this;
    let _from = page_from;
    let _to = parseInt( _from ) + parseInt( limit );
    let keyCode = _from+'_'+_to;

    let _orders = this.getObjOrders();

    axios.all([
      axios.get( allObjWithSomeInfo , { 'params' : { '_from' : _from, '_to' : _to, 'orders' : _orders } } ),
      axios.get( allObjCount ) ])
        .then(axios.spread(function(obj,_count){
          obj.data.qs.forEach( (item) => { 
            item.selected = false; 
            this.cached_data[ item.id ] = item;
          });
          let { limit } = this;
          let { count } = _count.data;
          let _counted = obj.data.qs.length;
          this.page_from = _from;
          this.page_to = _to;
          this.max_page = Math.ceil( parseInt(count) / parseInt(limit) );
          this.current_page = 1;
          this.counted_list = _counted;
          this.all_count = count;
          this.list_of_obj =  obj.data.qs;
          // this.cached_obj = {}; // clear cached
          // this.cached_obj[ keyCode ] = obj.data.qs;
          this.searchKey = '';
          this.queriedAll = true;
        }.bind(this)))
  }
  @computed get allSelected(){
    let { list_of_obj } = this;
    let all_selected = [];
    list_of_obj.forEach( function(item, idx){
      if( item.selected ){
        all_selected.push(item);
      }
    });
    return all_selected;
  }
  // end here
}

let tabTableStore = new TabTableStore;

export default tabTableStore;
