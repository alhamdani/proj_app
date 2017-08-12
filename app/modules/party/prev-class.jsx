

class Person extends React.Component{
  render(){
    return(
      <div>

      </div>
    )
  }
}
class PaginationInput extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      input_val : 1,
      max_page : 11,
      current_page : 1
    }
  }
  componentDidMount(){
    let _page = localStorage.getItem('input_pagination');
    if( _page ){
      this.updateInputField( parseInt( _page ) );
    }
  }
  inputChange(){
    console.log('changing input');
  }
  
  focusIn(){
    let { current_page  } = this.state;
    this.refs.page_map.value = current_page;
  }
  focusOut(){
    let { current_page, max_page, input_val } = this.state;
    let new_val = parseInt( this.refs.page_map.value );
    if( new_val >= 1 && new_val <= max_page ){
      
    }else{
      new_val = current_page;
    }
    this.updateInputField( new_val );
  }
  updateInputField( new_val ){
    if( new_val ){
      let { current_page, max_page } = this.state;
      this.refs.page_map.value = new_val + ' of ' + max_page;
      this.setState({
        current_page : new_val
      });
      localStorage.setItem('input_pagination', new_val);
    }
  }
  keyPress(ev){
    if( ev.which === 13 ){
      this.refs.page_map.blur();
    }
  }
  nextPage( ev ){
    let { current_page, max_page } = this.state;
    current_page += 1;
    if( current_page <= max_page ){
      this.updateInputField(current_page);
    }
  }
  prevPage( ev ){
    let { current_page } = this.state;
    current_page -= 1;
    if( current_page > 0 ){
      this.updateInputField(current_page);
    }
  }
  render(){
    let { current_page, input_val, max_page } = this.state;
    let page_map_val = current_page + ' of ' + max_page;
    return(
      <div className = "input-pagination">
        <button 
          className = 'prev-btn' 
          onClick = { this.prevPage.bind(this) }
          disabled = { ( current_page === 1 ? true : false ) } 
          >Prev</button>
        <input type = "text" 
          onChange = { this.inputChange.bind(this) } 
          onFocus = { this.focusIn.bind(this) }
          onBlur = { this.focusOut.bind(this) }
          onKeyPress = { this.keyPress.bind(this) }
          defaultValue = { page_map_val } 
          ref = 'page_map' />
        <button 
          className = 'next-btn' 
          onClick = { this.nextPage.bind(this) }
          disabled = { ( current_page === max_page ? true : false )}
          >Next</button>
      </div> 
    )
  }
}
class Pagination extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      limit : 0,
      current_page : 1,
      pages : 0,
      end_page : 0,
      start_page : 1,
      page_list : []
    }
  }
  componentWillMount(){
    this.setState({
      current_page : 1,
      pages : 15
    })
  }
  componentDidMount(){
    let _p = localStorage.getItem('pagination');
    let { current_page, pages, start_page, end_page } = this.state;
    end_page = start_page + 9; // 1 + 9 = 10
    let page_list = [];
    
    if( end_page <= pages ){
      for( let x = start_page; x <= end_page; x++){
        page_list.push(x);
      }
      this.setState({
        page_list : page_list,
        end_page : page_list[ (page_list.length-1) ]
      })
    }
    
  }
  prevPage(){
    let { current_page, start_page, end_page } = this.state;
    if( current_page > 1 ){
      current_page = current_page - 1;
      this.setState({
        current_page : current_page
      })
      if( current_page === start_page ){
        let page_list = [];
        start_page -= 1;
        end_page -= 1;
        if( start_page > 0 ){
          for( let x = start_page; x <= end_page ; x++ ){
            page_list.push(x);
          }
          this.setState({
            page_list : page_list,
            start_page : start_page,
            end_page : end_page
          })
        }
      }
    }
  }
  nextPage(){
    let {current_page} = this.state;
    let { pages, end_page, start_page } = this.state;
    if( current_page < pages ){
      current_page = current_page + 1;
      this.setState({
        current_page : current_page
      });
      if( current_page === end_page ){
        start_page += 1;
        end_page += 1;
        if( end_page <= pages ){
          let page_list = [];
          for( let x = start_page; x <= end_page; x++){
            page_list.push(x);
          }
          this.setState({
            page_list : page_list,
            start_page : start_page,
            end_page : end_page
          });
        }
      }
    }
  }
  setActiveBtn( idx ){
    this.setState({
      current_page : idx
    });
  }
  render (){
    let btn_list = [];
    let limit = 25;
    let { current_page, page_list, pages } = this.state;
    
    for ( let x = 0; x < page_list.length; x++ ){
      let val = page_list[x];
      btn_list.push( 
        <button 
          className = { ( val === current_page ? 'active-page-btn' : '' ) }
          key = { x }
          onClick = { this.setActiveBtn.bind( this, val ) }> 
          { val } 
        </button>
      )
    }
    return (
      <div className = "pagination">
        <button className = "page-prev" disabled = { ( current_page === 1 ? true : false ) } onClick = { this.prevPage.bind(this) }>Prev</button>
          { btn_list }
        <button className = "page-next" disabled = { ( current_page === pages ? true : false )} onClick = { this.nextPage.bind(this) }>Next</button>
      </div>
    )
  }
}




// tab-table-view.jsx
/*
  // label += item[x].charAt(0).toUpperCase() + item[x].substring(1).toLowerCase() +' ';
*/
/*
@inject( 'actionMenuStore') @observer
class TableView extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      person_count : 0,
      selectedOnContextMenu : null,
      isChecked : false
    }
  }
  hideMenu(){
    let { visible } = this.props.actionMenuStore;
    let { selectedOnContextMenu } = this.state;
    if( visible ){ 
      this.props.actionMenuStore.hideContextMenu();
      selectedOnContextMenu.classList.remove('selected-row-on-context-menu');
    }
  }
  componentDidMount(){ 
    this.props.givenStore.countList();
    document.addEventListener('click', function(ev){
      this.hideMenu();
    }.bind(this));
  }
  toggleCheckall(){ 
    this.props.givenStore.toggleSelectedOnCurrentObj();
    let { all_selected } = this.props.givenStore.obj_list;
    this.props.givenStore.obj_list.all_selected = !all_selected;
  }
  updateSelectedOnContextMenu( tr ){
    let { selectedOnContextMenu } = this.state;
    if( selectedOnContextMenu !== null ){
      selectedOnContextMenu.classList.remove('selected-row-on-context-menu');
    }
    tr.classList.add('selected-row-on-context-menu');
    this.setState({
      selectedOnContextMenu : tr
    });
  }
  updateSelectedItem( item, toRemove ){
    this.props.givenStore.updateSelectedItem(item, toRemove);
  }
  render(){
    let { actionMenuStore, updaterFn, setSelected, listHeaderLabel } = this.props;
    let { obj_list, isCounted, isLoaded, all_count, isAllSelected } = this.props.givenStore;
    let { isChecked } = this.state;
    let table_row = [];
    let table_header = [];
    let objHeader = null;

    let isAllChecked = false; // --- o O o ---
    if( isLoaded ){
      let objListKeys = Object.keys(obj_list); // get the keys on the obj_list
      if( objListKeys.length ){ // if found any key 
        let firstObj = obj_list[ objListKeys[0] ];
        let keysOnFirstObj = Object.keys(obj_list[ objListKeys[0] ]);
        
        if( keysOnFirstObj.length > 0 ){ // if the keys of the first objects is more than one
          keysOnFirstObj.forEach(function( key, idx ){
            let loweredKey = key.toLowerCase();
            // if key has id and selected on it then don't show on the table row
            if( key !== 'id' && key !== 'selected' ){
              let splitted_key = key.split('_');
              let label = '';
              for(let x = 0; x < splitted_key.length; x++ ){
                label += splitted_key[x] + ' ';
              }
              table_header.push( <th key = {idx} className = "table-header">{ label }</th> );
            }
          });
          for( let key in obj_list ){
            let item = obj_list[key];
            if( key !== 'all_selected'){
              let content = [];
              table_row.push(
                <TableRow 
                  updateSelectedOnContextMenu = { this.updateSelectedOnContextMenu.bind(this) } 
                    setSelected = { setSelected }
                      updateSelectedItem = { this.updateSelectedItem.bind(this) }
                        key = { key } 
                          item = { item } 
                              />
              )
            }
           
          }
        }
      }
    }
    let pagination = '';
    if( isCounted ){
      pagination = (
        <PaginationCombo updaterFn = { updaterFn } max_count = { all_count }/>
      )
    }
    
    return(
      <div>
        { pagination }
        <table className = 'tbl-v-1'>
          <thead>
            <tr>
              <th>
                <input 
                  type = "checkbox" 
                  checked = { isAllSelected }
                  onChange = { this.toggleCheckall.bind(this)}/>
              </th>
              { table_header }
            </tr>
          </thead>
          <tbody>
            { table_row }
          </tbody>
        </table>
      </div>
        
    ) // return 
  } // render 
}
@inject( 'actionMenuStore') @observer
class TableRow extends React.Component{
  constructor( props ){
    super(props);
    this.state = {
      isChecked : false
    }
  }
  toggleCheckbox(){
    let { selected } = this.props.item;
    this.props.item.selected = !selected;
  }
  componentDidMount(){
    
    
  }
  contextMenuFn(item, e){
    let { actionMenuStore } = this.props;
    let { pos_x, pos_y } = actionMenuStore;
    e.preventDefault();
    actionMenuStore.updateCoordinate( e.pageX, e.pageY );
    actionMenuStore.showContextMenu();
    this.props.setSelected( item );
    this.props.updateSelectedOnContextMenu( e.currentTarget );
  }
  render(){
    let { item, updateSelectedOnContextMenu } = this.props;
    let { selected } = item;
    let { isChecked } = this.state;

    let content = [];
    

    for( let key in item ){
      if( key !== 'id' && key.indexOf('selected') < 0 ){ 
        content.push(
          <td key = { key }>
            { item[key] }
          </td>
        );
      }
    }
    return (
      <tr 
        className = { selected ? 'contextmenu-trigger selected-row' : 'contextmenu-trigger' }
        onContextMenu = { this.contextMenuFn.bind(this, item) } >
          <td>
            <input checked = { selected } onChange = { this.toggleCheckbox.bind(this) } type = "checkbox"/>
          </td>
        { content }
      </tr>
    )
  }
}


class EditPersonForm extends React.Component{
  constructor ( props ){
    super(props);
    let { obj } = this.props;
    this.state = {
      f_name : obj.f_name,
      l_name : obj.l_name
    }
  }
  saveBtnHandler(ev){
    // ev.preventDefault();
    // let { obj } = this.props;
    // obj.f_name = this.state.f_name;
    // obj.l_name = this.state.l_name;
    // this.props.removeTab();
  }
  cancelBtnHandler(ev){
    // ev.preventDefault();
    // this.props.removeTab();
  }
  changeFname(ev){
    // console.log(ev.target.value);
    // let { value } = ev.target;
    // this.setState({
    //   f_name : value
    // })
  }
  changeLname(ev){
    // console.log(ev.target.value);
    // let { value } = ev.target;
    // this.setState({
    //   l_name : value
    // })
  }
  render(){
    let { obj, listHeaderLabel } = this.props;
    console.log(obj)

    let form_content = [];
    listHeaderLabel.forEach( function( el, idx ){
      let _w = el.name.split('_');
      let label = '';
      for( let x = 0; x < _w.length; x++ ){ label += _w[x]+' ';  }
      form_content.push( <Input key = {idx} ref = { el.name } label = { label } floatingLabel = { true } /> );
    });
    return (
      <Form>
        <legend>Title</legend>
        <Input label="Input 1" floatingLabel={true} />
        <Input label="Input 2" floatingLabel={true} defaultValue="Value on load" />
        <Button variant="raised" color = 'primary'>Submit</Button>
      </Form>
    )
  }
}

*/
/*
<form>
  <legend>Form</legend>
  <Input label = 'Firt name' floatingLabel = { true } value = { this.state.f_name } onChange = { this.changeFname.bind(this) } />
  <Input label = 'Last name' floatingLabel = { true } value = { this.state.l_name } onChange = { this.changeLname.bind(this) }/>
  <Button variant = 'raised' onClick = { this.saveBtnHandler.bind(this) }>Save</Button>
  <Button variant = 'raised' onClick = { this.cancelBtnHandler.bind(this) }>Cancel</Button>
</form>
*/
/*
class PaginationCombo extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      pages : 0,
      current_page : 1,
      limit : 5,
      _from : 0,
      _to : 5
    };
  }
  componentDidMount(){
    let { _from, _to, limit } = this.state;
    // console.log(limit);
    this.updateMaxPage( limit );
    this.props.updaterFn( _from, _to );
  }
  updateMaxPage( limit ){
    let { max_count } = this.props;
    if( max_count ){
      max_count = max_count ? max_count : 0;
      let pages = Math.ceil( max_count/limit );
      this.setState({
        pages : pages
      });
    }
  }
  changeLimit(ev){
    let { _from, _to, pages, current_page, limit } = this.state;
    let value = parseInt( ev.target.value, 10 )
    _to = value * current_page;
    _from = parseInt(_to) - parseInt(value);
    this.setState({
      limit : value,
      _from : _from,
      _to : _to
    });
    this.updateMaxPage( value );
    this.props.updaterFn( _from, _to );
  }
  keyPress(ev){
    if( ev.which === 13 ){
      let { pages, limit, _from, _to } = this.state;
      let { value } = this.refs.goto;
      value = parseInt( value, 10 );
      if( value && value > 0 && value <= pages ){
        _to = value * parseInt(limit, 10);
        _from = parseInt(_to,10) - parseInt(limit, 10);
        this.refs.goto.blur();
        this.updatePage( _from, _to, value );
      }
    }
  }
  prevPage(){
    let { current_page, limit, _from, _to } = this.state;
    current_page -= 1;
    if( current_page > 0 ){
      _to = _from;
      _from = ( parseInt(_to, 10) - parseInt(limit, 10) );
      if( _from < 0 ){ // if less than zero
        _from = 0;
        _to = parseInt(_from) + parseInt(limit);
      }
      this.updatePage( _from, _to, current_page );
    }
  }
  updatePage( _from, _to, current_page ){
    this.setState({
      current_page : current_page,
      _from : _from,
      _to : _to
    });
    this.props.updaterFn( _from, _to );
    this.refs.goto.value = current_page;
  }
  nextPage(){
    let { current_page, pages, limit, _from, _to } = this.state;
    let { max_count } = this.props;
    current_page += 1;
    if( current_page <= pages ){
      _from = _to;
      _to = parseInt(_from) + parseInt(limit);
      _to = parseInt(_to) <= parseInt(max_count) ? _to : max_count;
      this.updatePage( _from, _to, current_page );
    }
  }
  render(){
    let { pages, current_page, limit, _from, _to } = this.state;
    let { max_count } = this.props;
    _from += 1;
    return(
      <div className = "pagination-combo">
        <div className = 'limiter'>
          <label> Limit </label>
          <select onChange = { this.changeLimit.bind(this) } value = { limit } >
            <option value = '5'>5</option>
            <option value = '10'>10</option>
            <option value = '20'>20</option>
            <option value = '30'>30</option>
            <option value = '40'>40</option>
            <option value = '50'>50</option>
            <option value = 'all'>All</option>
          </select>
        </div>
        <div className = 'go-to'>
          <label>Go to </label>
          <input ref = 'goto' defaultValue = { current_page } onKeyPress = { this.keyPress.bind(this) }/> of { pages }
        </div>
        <div className = 'page-map'>
          <button className="btn-prev" onClick = { this.prevPage.bind(this) }>{('<')}</button>
          <label>
              { _from } - { _to } of { max_count }
          </label>
          <button className = "btn-next" onClick = { this.nextPage.bind(this) }> {('>')} </button>
        </div>
      </div>
    )
  }
}
*/

