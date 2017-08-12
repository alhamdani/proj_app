import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';

import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class PersonStore{
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
    console.log(_toSelectCounter, _counted )
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
        console.log(rs.data.qs)
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







  // previous code ------------------------------------------


  /*
  updateSearchObj codes

  // if( this.cached_obj[ keyCode ] !== undefined ){
    //   this.list_of_obj = this.cached_obj[ keyCode ];
    //   let selected_counter = 0, counted = this.list_of_obj.length;
    //   this.list_of_obj.forEach(function(el){
    //     if( el.selected ){
    //       selected_counter += 1;
    //     }
    //   })
    //   if( selected_counter === counted ){
    //     this.select_all = true;
    //   }else{
    //     this.select_all = false;
    //   }
    //   this.counted_list = counted;
    // }else{
    //   axios.get('party/searchonparty', { 'params' : { 'search_for' : value, '_from' : _from, '_to' : _to } })
    //     .then(function(rs){
    //       rs.data.qs.forEach((item) => { item.selected = false; });
    //       this.list_of_obj = rs.data.qs;
    //       this.cached_obj[ keyCode ] = rs.data.qs;
    //     }.bind(this))
    // }
  updateObjList code
   // if( this.cached_obj[ keyCode ] !== undefined ){
    //   this.list_of_obj = this.cached_obj[ keyCode ];
    //   let selected_counter = 0, counted = this.list_of_obj.length;
    //   this.list_of_obj.forEach(function(el){
    //     if( el.selected ){
    //       selected_counter += 1;
    //     }
    //   })
    //   if( selected_counter === counted ){
    //     this.select_all = true;
    //   }else{
    //     this.select_all = false;
    //   }
    //   this.counted_list = counted;
    // }else{
    //   let _orders = [];
    //   this.filterFields.forEach(function(item){
    //     if( item.useToSort ){
    //       _orders.push(item.name);
    //     }else{
    //       _orders.push('-'+item.name);
    //     }
    //   })
    //   axios.get('party/getallperson/', { 'params' : { '_from' : _from, '_to' : _to, 'orders' : _orders } } )
    //     .then(function(rs){
    //       let _counted = rs.data.qs.length;
    //       rs.data.qs.forEach((item) => { item.selected = false; });
    //       this.list_of_obj = rs.data.qs;
    //       this.counted_list = _counted;
    //       this.cached_obj[ keyCode ] = rs.data.qs;
    //     }.bind(this))
    // } 
  */
  @observable isLoaded = false;
  @observable isCounted  = false;
  // @observable obj_list = [];
  @observable obj_list = {};
  // @observable cached_obj_list = [];
  @observable cached_obj_list = {};
  @observable selected_items = {};
  @observable obj_list_count = 0;
  @observable current_key_code = ''; // current_key_code
  @observable obj_final_count = 0;
  @observable isAllSelected = false;
  @action refreshObjList(){
    this.queryObjList(false,  this.current_key_code);
  }
  @action testGoto(value){
    this.current_page = value;
  }
  @action deleteSelectedItems(){
    if( this.selectedItemCounter > 0 ){
      let _current_key_code = this.current_key_code;
      if( this.obj_list.all_selected ){
        this.obj_list = {};
        this.cached_obj_list[ _current_key_code ] = {};
      }else{
        let obj = this.obj_list;
        for( let key in obj ){
          if( obj[key].selected ){
            this.obj_list[ key ] = {};
            this.cached_obj_list[ _current_key_code ][ key ] = {};
          }
        }
      }
      this.queryObjList( true, _current_key_code)
      this.selectedItemCounter = 0;
    }
  }
  queryObjList( isForDelete, keyCode ){
    let _key = keyCode.split('_');
    let _from = _key[0], _to = _key[1];
    axios.get('party/getallperson/', 
      { 'params' : { '_from' : _from, '_to' : _to } } )
        .then(function(rs){
          let arr = [], temp_obj = {};
          if( isForDelete === false ){ // if not for delete
            let _current_obj_list = this.obj_list;
            if( this.current_key_code !== '' ){ // if not on first load
              let _current_key_code = this.current_key_code;
              // update the changes on the _current_obj_list
              for( let key in _current_obj_list ){
                if( key !== 'all_selected' ){
                  for( let _key in _current_obj_list[ key ] ){
                    this.cached_obj_list[ _current_key_code ][key][_key] = _current_obj_list[ key ][_key];
                  }
                }else{
                  this.cached_obj_list[ _current_key_code ][key] = _current_obj_list[ key ];
                }
              }
            }
          }
          
          rs.data.qs.forEach(function(item){ // store new items
            item.selected = false;
            temp_obj[ item.id ] = item;
          });

          this.obj_list = temp_obj;
          this.obj_list['all_selected'] = false;
          this.cached_obj_list[ keyCode ] = this.obj_list;
          this.current_key_code = keyCode; // update current_key_code 
          this.isLoaded = true;
          this.isAllSelected = false;
          
        }.bind(this));
  }
  @action searchObj(value){
   
    if( value.length >= 2 ){
      axios.get('party/searchonparty', { 'params' : { 'search_for' : value } } )
        .then(function(rs){
          let data = rs.data.qs;
          this.obj_list_count = data.length;
        }.bind(this))
    }else{
      if( value == '' ){
        this.queryObjList( true, this.current_key_code);
        this.obj_list_count = this.final_count;
      }
    }
  }
  @action counterUpdater( isSelected ){
    if( isSelected ){ 
      this.selectedItemCounter += 1; 
    }else{ 
      this.selectedItemCounter -= 1; 
    }

    if( ( this.selectedItemCounter ) === (Object.keys(this.obj_list).length - 1)){ // minus one because the last entry on the obj_list is 'all_selected'
      this.isAllSelected = true;
      this.obj_list.all_selected = true;
    }else{
      this.isAllSelected = false;
      this.obj_list.all_selected = false;
    }
  }
  @action toggleSelectedOnCurrentObj(){
    let _current_obj_list = this.obj_list;
    let _val = this.isAllSelected;
    this.isAllSelected = !_val;
    for( let key in _current_obj_list ){
      if( key !== 'all_selected' ){
        if( Object.keys(this.obj_list[key]).length){
          this.obj_list[key].selected = !_val;
        }
      }
    }
    if( this.isAllSelected ){
      this.selectedItemCounter = Object.keys(this.obj_list).length - 1; // minus one because the last entry on the obj_list is 'all_selected'
    }else{
      this.selectedItemCounter = 0;
    }
  }
  @action countList(){ 
    axios.get( 'party/getallpersoncount/')
      .then(function(rs){
        this.obj_list_count = rs.data.count;
        this.final_count = rs.data.count;
        this.isCounted = true;
      }.bind(this));
  }
  @action updateSelectedItem( item, toRemove ){
    console.log( toRemove )
    if( toRemove ){
      delete this.selected_items[item.id];
    }else{
      if( this.selected_items[item.id] === undefined ){
        this.selected_items[item.id] = item;
      }
    }
    console.log(this.selected_items)
  }
  @action addSelectedItem(item){ }
  
  @action storeListUpdater( _from, _to ){ 
    let keyCode = _from + '_' + _to; // incoming keyCode ( either new or cached )
    this.isLoaded = false;
    
    if( this.cached_obj_list[ keyCode ] !== undefined ){ // if keycode already cached
      let temp_obj = {};
      let _cached_obj_list = this.cached_obj_list[ keyCode ];
      let _current_key_code = this.current_key_code;
      let _current_obj_list = this.obj_list;
      for( let key in _current_obj_list ){
        if( key !== 'all_selected' ){
          for( let _key in _current_obj_list[ key ] ){
            this.cached_obj_list[ _current_key_code ][key][_key] = _current_obj_list[ key ][_key];
          }
        }else{
          this.cached_obj_list[ _current_key_code ][key] = _current_obj_list[ key ]
        }
      }
      // update obj_list
      for( let key in _cached_obj_list ){
        temp_obj[ key ] = _cached_obj_list[ key ];
      }
      this.obj_list = temp_obj;
      this.current_key_code = keyCode;
      this.isLoaded = true;
      
      this.isAllSelected = this.obj_list.all_selected;
    }else{
      this.queryObjList( false, keyCode );
    }
  }
  // end of previous --------------------------------------------
}

let personStore = new PersonStore;

export default personStore;

/*
if( parseInt(_to) <= this.cached_obj_list.length ){ // if not on the range
      console.log('if -- ')
      let arr = this.cached_obj_list;
      this.obj_list.forEach((item) => (console.log(item)));
      this.obj_list = arr.slice(_from, _to);
    }else{
      axios.get('party/getallperson/', 
        { 'params' : { '_from' : _from, '_to' : _to } } )
          .then(function(rs){
            this.isLoaded = true;
            let arr = this.cached_obj_list, arr2 = [];
            rs.data.qs.forEach(function(item){ // cached new items
              item.selected = false;
              arr.push(item);
              arr2.push(item);
            });
            this.cached_obj_list = arr;
            this.obj_list = arr2;
            this.obj_list.forEach((item) => (console.log(item)));
          }.bind(this));
     
    }
*/