import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";



class HeaderDetails{
  @observable isLoaded = false;
  @observable _inputs = [];
  @observable _tabs = [ ];
  
  @observable isCompleteAdding = false;
  @observable isForAddingHeaderDetails = false;
  @observable headerId = 0;
  // +++++++++++++++++++++++++++++++++++++ on details +++++++++++++++++++++++++++++++++++++
  // @observable editingOnDetails = true;
  @observable editingOnDetails = false;
  @observable _active_tabs = {};
  @observable _data_on_active_tab = [];
  @observable isAllSelected = false;
  @observable idx_selected = [];
  @observable isVariableSetUp = false;
  @observable isDataOnActiveTabLoaded = false;
  @observable toAddListIdx = [];
  @observable editedIdx = [];
  @observable header_id = 0;
  // @observable _data_on_active = [];

  @action setVariables( tabs, inputs, header_id ){
    /*
      this._tabs = [
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
            // the name of column
            'branch' : { 'url' : 'documents/sample_q1' },
            'branch2' : { 'url' : 'documents/sample_q3' },
            'branch3' : { 'url' : 'documents/sample_q4' },
          },
          'onLookups' : { 
            // the name of column
            'warehouse' : { 'url' : 'documents/sample_q2', 'options' : [] },
            'warehouse2' : { 'url' : 'documents/sample_q5', 'options' : [] },
            'warehouse3' : { 'url' : 'documents/sample_q6', 'options' : [] },
          },
          'relations':{
            // name of the column : the formula
            'total' : { 'formula' : '( unit_price * quantity )', 'decimal_place' : 2 }
          },
          cols : [ 
            { 'label' : 'Branch', 'name' : 'branch', 'type' : 'select', 'size' : 2  },
            { 'label' : 'Quantity', 'name' : 'quantity', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Unit Price', 'name' : 'unit_price', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Total', 'name' : 'total', 'type' : 'text' },
            { 'label' : 'Inventory Id', 'name' : 'inventory_id', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Warehouse', 'name' : 'warehouse', 'type' : 'lookup', 'size' : 2 },
            { 'label' : 'Line Description', 'name' : 'line_description', 'type' : 'input', 'size' : 2 },
            { 'label' : 'UOM', 'name' : 'unit_of_measure', 'type' : 'input', 'size' : 2 },
            { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship', 'type' : 'input' },
          ] },
        { 'label' : 'Tax details', 'name' : 'tax_details', 'url' : 'documents/tab2url',
            cols : [ 
                  { 'label' : 'Branch', 'name' : 'branch' },
                  { 'label' : 'Inventory Id', 'name' : 'inventory_id' },
                  { 'label' : 'Warehouse', 'name' : 'warehouse' },
                  { 'label' : 'Line Description', 'name' : 'line_description' },
                  { 'label' : 'UOM', 'name' : 'unit_of_measure' },
                  { 'label' : 'Quantity', 'name' : 'quantity' },
                  { 'label' : 'Quantity on shipments', 'name' : 'quantity_ship' },
                  { 'label' : 'Unit Price', 'name' : 'unit_price' },
                ] },
        { 'label' : 'Commission', 'name' : 'comm_details', 'url' : 'documents/tab3url' },
        { 'label' : 'Financial Setting', 'name' : 'finan_details', 'url' : 'documents/tab4url' },
        { 'label' : 'Payment', 'name' : 'pay_details', 'url' : 'documents/tab5url' },
        { 'label' : 'Shipping', 'name' : 'ship_details', 'url' : 'documents/tab6url' },
      ]
      [
        { 'name' : 'order_type', 'label' : 'Order type', 'size' : '3', 'type' : 'select' },
        { 'name' : 'order_number', 'label' : 'Order number', 'size' : '3', 'type' : 'input' },
        { 'name' : 'order_date', 'label' : 'Order date', 'size' : '3', 'type' : 'date' },
      ],[
        { 'name' : 'request_on', 'label' : 'Requested On', 'size' : '3', 'type' : 'lookup', 'url' : 'documents/requestonlookup' },
      ],[
        { 'name' : 'date_created', 'label' : 'Date created', 'size' : '4-5', 'type' : 'date' }
      ],[
        { 'name' : 'order_type2', 'label' : 'Order type 2', 'size' : '5', 'type' : 'textarea' },
      ]
    */
    if( header_id ){
      this.header_id = header_id;
      this.isForAddingHeaderDetails = false;
    }else{
      this.isForAddingHeaderDetails = true;
    }
    this._tabs = tabs;
    this._inputs = inputs;
    this.isVariableSetUp = true;
  }

  @action setUpHeaderId( headerId ){
    this.headerId = headerId;
    this.isCompleteAdding = true;
    console.log('set up header')
  }
  @action setUpDetails(){
    this._active_tabs = this._tabs[0];
  }

  @action addNewData( data ){
    this.toAddListIdx.push( ( this._data_on_active_tab.length ) );
    this._data_on_active_tab.push(data);
  }
  @action toggleAllSelected(){
    let { isAllSelected } = this;
    let data_on_active_tab = [...this._data_on_active_tab]; // copy and make new array
    let _idx_selected = [];
    data_on_active_tab.forEach((item, idx)=>{
      let _obj = Object.assign( {}, item );
      if( !isAllSelected){
        _idx_selected.push( idx );
      }
      _obj.isSelected = !isAllSelected;
    })
    this._data_on_active_tab = data_on_active_tab;
    this.isAllSelected = !isAllSelected;
    this.idx_selected = _idx_selected;
  }
  @action updateInputObjValue( value, idx, col, label ){ // applicable only in select and lookup inputs
    let _obj = {};
    if( label !== undefined ){
      _obj.label = label;
    }
    _obj.default_value = value;
    this._data_on_active_tab[idx][col] = _obj;
  }
  @action toggleRowIsSelected( rowIdx ){ }

  @action addIdxOnEdited( idx ){
    if( this.editedIdx.indexOf( idx ) < 0 ){
      this.editedIdx.push( idx );
    }
  }
  onEditRow( _arr_to_submit ){
    let savingUrl = this._active_tabs['savingUrl']
    if( _arr_to_submit.length ){
      
    }
  }
  onNewRow( _arr_to_submit ){
    let savingUrl = this._active_tabs['savingUrl']
    if( _arr_to_submit.length ){
      
    }
  }
  generateValueFromFormula( row, relation ){
    let formula = relation['formula'];
    let decimal_place = relation['decimal_place'];
    let _row = Object.assign({}, row );
    for( let key in row ){ // get the columns on the formula
      if( formula.indexOf(key) >= 0 ){
        if( row[key] != '' ){
          formula = formula.replace(key, _row[key]);
        }
      }
    }
    let final_value = '';
    try{
      final_value =  eval( formula );
      // let result = eval( formula );
      // final_value = Number(Math.round(result+'e'+decimal_place)+'e-'+decimal_place);
    }catch(e){}
    return final_value;
  }

  submitNewData( newData ){
    if( newData.length ){
      let relations;
      if( this._active_tabs ){
        relations = this._active_tabs['relations'];
      }
      let final_data = newData.map((item,idx)=>{
        let _new_obj = {};
        for(let key in item){
          if( typeof item[key]== 'object' ){
            let _key = key+'_id';
            _new_obj[_key] = item[key].default_value;
          }else{
            let _val = item[key];
            if( relations ){
              if( relations[key] ){
                _val = this.generateValueFromFormula( item, relations[ key ] );
              }
            }
            _new_obj[key] = _val;
          }
        }
        return _new_obj;
      })
      axios.post( this._active_tabs['savingUrl'] +'/', { 'new_datas' : final_data, 'headerId' : this.header_id } )
        .then( (rs)=>{
          let data = rs.data.qs;
          let data_on_active_tab = [...this._data_on_active_tab];
          data.forEach((item)=>{
            data_on_active_tab[item.idx].id = item.id;
            delete data_on_active_tab[item.idx].toAdd;
          });
          this._data_on_active_tab = data_on_active_tab;
          this.editedIdx = [];
        })
    }
  }
  @action saveEdited(){
    let { editingOnDetails, editedIdx } = this;
    let _arr = [], _newData = [];
    // console.log([...editedIdx]);
    if( editedIdx.length ){
      editedIdx.forEach((idx)=>{
        let obj_copy = Object.assign( {}, this._data_on_active_tab[idx] ); // copy new instance
        // this key may not be needed anymore because we are now using index base but for maybe later purpose
        delete obj_copy['isSelected']; // remove isSelected column for submitting
        // add idx column use for updating data (when server returned response idx use to update row)
        obj_copy['idx'] = idx; 
        if( obj_copy.toAdd ){
          delete obj_copy['toAdd']; // remove toAdd column for submitting the info to the server
        }
        _newData.push( obj_copy );
      })
      this.submitNewData( _newData );
    }
    if( editingOnDetails ){
      this.editingOnDetails = false;
    }
  }
  @action toggleDetailsEditing(){
    let { editingOnDetails } = this;
    if( !editingOnDetails ) this.editingOnDetails = !editingOnDetails;
  }
  @action toggleIsSelected( idx ){
    let idx_selected = [...this.idx_selected];
    let foundIdx = idx_selected.indexOf( idx );
    if( foundIdx >= 0 ) idx_selected.splice( foundIdx, 1 ); 
    else idx_selected.push( idx );  
    if( idx_selected.length == this._data_on_active_tab.length ) this.isAllSelected = true; 
    else this.isAllSelected = false; 
    this.idx_selected = idx_selected;
  }
  @action deleteSelectedRow(){
    let { isAllSelected, idx_selected } = this;
    let _ids = [];
    let editedIdx = [ ...this.editedIdx ];
    let _data_on_active_tab_copy = [...this._data_on_active_tab];
    let ids_to_remove = [];
    let q = _data_on_active_tab_copy.map((item, idx)=>{
      if( idx_selected.indexOf( idx ) < 0 ){ // if index not found in the idx_selected
        return item;
      }else{
        let foundIdxOnEdited = editedIdx.indexOf(idx); // if the index exist on editedIdx
        if( foundIdxOnEdited >= 0 ){
          editedIdx.splice( foundIdxOnEdited, 1 ); 
        }
        ids_to_remove.push( item.id ); // add the ID to the list of item to delete
      }
    })
    this._data_on_active_tab = q;
    this.idx_selected = [];
    this.isAllSelected = false;
    this.editedIdx = editedIdx;
    // send the ids to delete
    axios.post( this._active_tabs['deleteUrl'] +'/', { 'delete_ids' : ids_to_remove } ) 
      .then( (rs) => {
        console.log(rs);
      })
  }
  @action saveNewAdded(){
    let toAddListIdxCopy = this.toAddListIdx.slice('');
    // console.log(toAddListIdxCopy)
    let _arr = [];
    let _obj_ = {}; // use for updating _data_on_active_tab
    toAddListIdxCopy.forEach((item, idx)=>{
      let _new_obj = {};
      _obj_[ item ] = {};
      let _q = this._data_on_active_tab[ item ];
      for( let key in _q ){
        if( key != 'toAdd' && key != 'isSelected' ){ // remove the 'toAdd' and 'isSelected' columns
          if( typeof _q[key] == 'object' ){
            _obj_[ item ][ key ] = Object.assign( {}, _q[key] );
            let _key =  key+'_id';
            _new_obj[ _key ] = _q[key].default_value;
          }else
            _obj_[ item ][ key ] = _q[key];
            _new_obj[key] = _q[key];
        }
      }
      _new_obj.idx = item; // use idx to keep track what is the item idx when return
      _arr.push( _new_obj );
    })
    let new_data = { headerId : this.header_id, new_datas : _arr };
    
    axios.post( this._active_tabs['savingUrl'] +'/', new_data )
        .then( (rs) => {
          let data = rs.data.qs;
          data.forEach((item)=>{
            _obj_[item.idx].id = item.id;
            this._data_on_active_tab[ item.idx ] = _obj_[item.idx];
          })
          this.toAddListIdx = [];
          // console.log(rs);
          console.log( 'new data saved');
        })
  }
  getData(url){
    let headerId = this.header_id;
    
    return axios.get(url, { params: {'headerId' : headerId} });
  }
  
  @action setTabAsActive( idx ){
    let tab = this._tabs[idx];
    this._active_tabs = tab
    this.isDataOnActiveTabLoaded = false;
    this.queryOptionUrlsAndUpdateData();
    // this.getData( tab.url )
    //   .then((rs) => {
    //     let data = rs.data.qs;
    //     this._data_on_active_tab = data;
    //     this.isDataOnActiveTabLoaded = true;
    //   })
  }
  @action updateInputValue( value, idx, col ){
    let data_on_active_tab = this._data_on_active_tab;
    data_on_active_tab[ idx ][ col ] = value;
  }
  @action queryOptionUrlsAndUpdateData(){
    let { onOptions, onLookups } = this._active_tabs;
    let queries = [];

    this.isDataOnActiveTabLoaded = false; // on loading state of tab

    for( let key in onOptions ){ // make a promise to query on Option
      let item = onOptions[key];
      queries.push( this.getData(item.url ) );
    }

    axios.all( queries ) // query all the promises
      .then( (...args)=>{
        let data = args[0];
        data.forEach((item)=>{ // update all the option values
          let _data = item.data.qs;
          try{
            // onOptions[ _data.name ].options = _data.options;
            this._active_tabs.onOptions[ _data.name ].options = _data.options;
          }catch(e){}
        })
        if( !this.isCompleteAdding ){ // if adding 
          this._active_tabs.current_datas = [];
          this.isLoaded = true;
          this._data_on_active_tab = [];
          this.isDataOnActiveTabLoaded = true;
          this.idx_selected = [];
          this.toAddListIdx = [];
          this.editedIdx = [];
        }else{
          // console.log(this._active_tabs.url)
          this.getData( this._active_tabs.url )
            .then((rs)=>{
              let data = rs.data.qs;
              // console.log(data);
              /*
              data = [
                {
                  comments : '',
                  delivery_date : '2017-09-01',
                  id : 123,
                  product : { default_value : 23, label : 'Product 1' },
                  quantity : 1,
                  unit_price : 1,
                },{
                  comments : '',
                  delivery_date : '2017-02-01',
                  id : 423,
                  product : { default_value : 2314, label : 'Second Product' },
                  quantity : 2,
                  unit_price : 2,
                },{
                  comments : '',
                  delivery_date : '2017-04-01',
                  id : 2234,
                  product : { default_value : 2423, label : 'Third Product' },
                  quantity : 3,
                  unit_price : 3,
                },{
                  comments : '',
                  delivery_date : '2017-05-01',
                  id : 241,
                  product : { default_value : 4423, label : 'Fourt Product' },
                  quantity : 4,
                  unit_price : 4,
                }
              ]
              */
              data.forEach((item)=>{
                item.isSelected = false;
              })
              
              
              
              this._active_tabs.current_datas = data;
              this.isLoaded = true;
              this._data_on_active_tab = data;
              this.isDataOnActiveTabLoaded = true;
              this.idx_selected = [];
              this.toAddListIdx = [];
              this.editedIdx = [];
              // console.log('finished setting up store variable')
            })
        }
      })
  }
}


let headerDetails = new HeaderDetails;
export default headerDetails;

// if( isAllSelected ){
    //   this._data_on_active_tab.forEach(( item, idx )=>{
    //     _ids.push( item.id );
    //     _idx_to_remove.push( idx );
    //   });
    // }else{
    //   idx_selected.forEach( (idx) => {
    //     _ids.push( this._data_on_active_tab[idx].id );
    //     _idx_to_remove.push( idx );
    //   })
    // }
    // console.log(_idx_to_remove);
    // this.idx_selected = [];
    // axios.post( this._active_tabs['deleteUrl'] +'/', { 'delete_ids' : _ids } )
    //   .then( (rs) => {
    //     for( let x = (_idx_to_remove.length - 1); x >= 0; x-- ){
    //       let idx = _idx_to_remove[x];
    //       console.log(idx);
    //       _data_on_active_tab_copy.splice( idx, 1 );
    //     }
    //     console.log(_data_on_active_tab_copy);
    //     this._data_on_active_tab = _data_on_active_tab_copy;
    //   })