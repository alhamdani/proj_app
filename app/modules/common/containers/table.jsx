import React from 'react';
import {Link} from 'react-router';

import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// ListView == Table
export default class ListView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rows : [],
      pg_from : 0,
      pg_to : 0,
      canGoNext : true,
      canGoPrev : true,
      isDataLoaded : false,
      selectedIds : [],
      searchKey : ''
    }
  }
  componentDidMount(){
    this.updateRows();
  }
  getNextPage(){
    let { params } = this.props.router;
    if( params.page !== undefined ){
      return (parseInt(params.page) + 1);
    }else{
      return 2;
    }
  }
  getPrevPage(){
    let { params } = this.props.router;
    if( params.page !== undefined ){
      let page = parseInt(params.page);
      if( page > 2 ){
        return ( page - 1 )
      }
    }
    return 1;
  }
  getLimitParams(){
    let { params } = this.props.router;
    return params.limit;
  }
  getCurrentPage(){
    let { params } = this.props.router;
    return parseInt(params.page);
  }
  changeLimit(ev){
    let val = ev.target.value;
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/1/'+ val;
    this.props.router.push( _url );
    this.updateRows();
  }
  updateRows(){
    let { params } = this.props.router;
    let { page, limit } = params;
    let { QUrlList, QSearchUrl, columns } = this.props;
    let { searchKey } = this.state;
    
    this.setState({ isDataLoaded : false });
    if( searchKey != '' ){
      axios.post( QSearchUrl, { 'page' : page, 'limit' : limit, 'searchKey' : searchKey, 'columns' : columns})
        .then((rs)=>{
          let data = rs.data.qs;
          this.setUpVariables( data );
          console.log(' - return data guide - ');
          console.log(data)
          console.log(' - end -')
        })
    }else{
      axios.post( QUrlList, { 'page' : page, 'limit' : limit } )
        .then((rs)=>{
          let data = rs.data.qs;
          this.setUpVariables( data );
          console.log(' - return data guide - ');
          console.log(data)
          console.log(' - end -')
        })
    }
   
  }
  setUpVariables(data){
    let { params } = this.props.router;
    // console.log('params values ',params)
    let { page, limit } = params;
    let { selectedIds } = this.state;
    data.forEach((item)=>{
      if( selectedIds.indexOf(item.id) >= 0 ){
        item.selected = true;
      }else{
        item.selected = false;
      }
    });

    let _to = parseInt(page) * parseInt(limit);
    let _from = _to - limit;
    let _x = _to - _from;
    let _canGoNext = true;
    let _canGoPrev = true;
    if( data.length < _x ){
      _to = _from + data.length;
      _canGoNext = false;
    }
    if( page == 1 ){
      _canGoPrev = false;
    }
    let __f = data.length > 0 ? (_from + 1) : 0;
    this.setState({
      rows : data,
      pg_from : __f,
      pg_to : _to,
      canGoNext : _canGoNext,
      canGoPrev : _canGoPrev,
      isDataLoaded : true
    });
  }
  contructTds(row){
    let { columns, mainUrl, fkToUse } = this.props;
    let idToUse = row.id;
    if( fkToUse !== undefined ){
      idToUse = row[ fkToUse ]
    }
    let moreInfoUrl = mainUrl+'moreinfo/'+idToUse;
    return columns.map(( item, idx ) => {
      return (
        <td key = { idx }>
          <Link to = { moreInfoUrl } >
            { ( row[ item ] )}
          </Link>
        </td>
      )
    })    
  }
  chxboxOnChange(item, ev){
    let { rows, selectedIds } = this.state;
    item.selected = ev.target.checked;
    if( ev.target.checked ){
      selectedIds.push( item.id );
    }else{
      let idx = selectedIds.indexOf(item.id);
      selectedIds.splice(idx, 1);
    }
    this.setState({rows : rows, selectedIds : selectedIds});
  }
  contructRows(){
    let { rows, pg_from } = this.state;
    let lmt = this.getLimitParams();
    let pg = this.getCurrentPage();
    if( rows.length ){
      return rows.map((item, idx) => {
        let num = ( (pg_from) + idx);
        let tds = this.contructTds(item);
        return (
          <tr key = { idx }>
            <td className = 'chxbox'>
              <input type = 'checkbox' checked = { item.selected } onChange = { this.chxboxOnChange.bind(this,item) }/>
            </td>
            <td className = 'num'>{num}</td>
            { tds }
          </tr>
        )
      });
    }else{
      return (
        <tr>
          <td colSpan = '20'>No Results Found</td>
        </tr>
      )
    }
    
  }
  prevPage(){
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/'+this.getPrevPage() +'/'+ limit;
    this.props.router.push( _url );
    this.updateRows();
  }
  nextPage(){
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/'+this.getNextPage() +'/'+ limit;
    this.props.router.push( _url );
    this.updateRows();
  }
  constructLimiter(){
    let limit = this.getLimitParams();
    return (
      <div className = 'hdr-lmtr'>
        <label> Limit </label>
        <select onChange = { this.changeLimit.bind(this) } value = { limit }>
          <option value = '10'>10</option>
          <option value = '20'>20</option>
          <option value = '30'>30</option>
          <option value = '40'>40</option>
          <option value = '50'>50</option>
        </select>
      </div>
    )
  }
  constructButtons(){
    let { pg_from, pg_to, canGoNext, canGoPrev } = this.state;
    return (
      <div className = 'hdr-page-ctrl'>
        <button onClick = { this.prevPage.bind( this ) } disabled = { ( !canGoPrev ) } className = 'prev-pg'>Prev</button>
        <span className = 'pg'>
          <span className = 'pg-from'>{pg_from}</span> - <span className = 'pg-to'>{pg_to}</span>
        </span>
        <button onClick = { this.nextPage.bind( this ) } disabled = { ( !canGoNext ) } className = 'nxt-pg'>Next</button>
      </div>
    )
  }
  onClickAddHandler(){
    let { mainUrl } = this.props;
    this.props.router.push( mainUrl + 'add' );

  }
  onClickDelBtn(){
    let { selectedIds, rows } = this.state;
    let { QDeleteUrl } = this.props;
    axios.post( QDeleteUrl , { 'ids' : selectedIds } )
      .then((rs)=>{
        // console.log( 'trying to delete selected ids ', selectedIds );
        if( rs.data.message == 'success'){
          this.updateRows();
        }
      })
  }
  constructMoreButton(){
    return(
      <div>
        <button onClick = { this.onClickDelBtn.bind(this) }>Del</button>
        <button onClick = { this.onClickAddHandler.bind(this) }>Add</button>
      </div>
    )
  }
  searchOnChange(ev){
    let visibility = true;
    if( ev.target.value != '' ){
      visibility = false;
    }
    this.setState({
      searchKey:ev.target.value,
      isDataLoaded : visibility
    })
  }
  searchOnKeyPress(ev){
    if( ev.which == 13 ){
      this.updateRows();
    }
  }
  onClickClearBtn(){
     
  }
  constructHeader(){
    let { tbl_hdr, colSizes } = this.props;
    if( tbl_hdr != undefined ){
      return tbl_hdr.map((item,idx)=>{
        let size = '';
        if( colSizes !== undefined ){
          size = colSizes[ idx ];
        }
         
        return( <th key = { idx } className = {('s'+size)}> { item } </th> )
      })
    }else{
      let { columns } = this.props;
      return columns.map((item,idx)=>{
        let size = '';
        if( colSizes !== undefined ){
          size = colSizes[ idx ];
        }
        return ( <th key = { idx } className = {('s'+size)}> { item } </th> )
      })
    }
  }
  render(){
    let { isDataLoaded, searchKey } = this.state;
    let rows = ''
    let btns = '';
    let lmtr = '';
    let content = '';
    let moreBtn = '';
    let tbl_hdrs = '';
    if( isDataLoaded ){
      tbl_hdrs = this.constructHeader();
      rows = this.contructRows();
      btns = this.constructButtons();
      lmtr = this.constructLimiter();
      moreBtn = this.constructMoreButton();
      content = (
        <div>
          
          <div className = 'tbl-hdr'>
            {moreBtn}
            {lmtr}
            {btns}
          </div>
          <table className = 'tbl'>
            <thead>
              <tr>
                <th className = 'nums'> # </th>
                <th className = 'chxboxes'></th>
                { tbl_hdrs }
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </div>
      );
    }else{
      content = ( <div> Waiting . . . </div> );
    }
    
    return(
      <div>
        <div>
          <input 
            type = 'text' 
              value = { searchKey } 
                onChange = { this.searchOnChange.bind(this) }
                  onKeyPress = { this.searchOnKeyPress.bind(this) }
                    placeholder = 'Search'/>
        </div>
        { content }
      </div>
    )
  }
}
/*
export default class Table extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      rows : [],
      pg_from : 0,
      pg_to : 0,
      canGoNext : true,
      canGoPrev : true,
      isDataLoaded : false,
      selectedIds : [],
      searchKey : ''
    }
  }
  componentDidMount(){
    this.updateRows();
  }
  getNextPage(){
    let { params } = this.props.router;
    if( params.page !== undefined ){
      return (parseInt(params.page) + 1);
    }else{
      return 2;
    }
  }
  getPrevPage(){
    let { params } = this.props.router;
    if( params.page !== undefined ){
      let page = parseInt(params.page);
      if( page > 2 ){
        return ( page - 1 )
      }
    }
    return 1;
  }
  getLimitParams(){
    let { params } = this.props.router;
    return params.limit;
  }
  getCurrentPage(){
    let { params } = this.props.router;
    return parseInt(params.page);
  }
  changeLimit(ev){
    let val = ev.target.value;
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/1/'+ val;
    this.props.router.push( _url );
    this.updateRows();
  }
  updateRows(){
    let { params } = this.props.router;
    let { page, limit } = params;
    let { QUrlList, QSearchUrl, columns } = this.props;
    let { searchKey } = this.state;
    
    this.setState({ isDataLoaded : false });
    if( searchKey != '' ){
      axios.post( QSearchUrl, { 'page' : page, 'limit' : limit, 'searchKey' : searchKey, 'columns' : columns})
        .then((rs)=>{
          let data = rs.data.qs;
          this.setUpVariables( data );
          console.log(' - return data guide - ');
          console.log(data)
          console.log(' - end -')
        })
    }else{
      axios.post( QUrlList, { 'page' : page, 'limit' : limit } )
        .then((rs)=>{
          let data = rs.data.qs;
          this.setUpVariables( data );
          console.log(' - return data guide - ');
          console.log(data)
          console.log(' - end -')
        })
    }
   
  }
  setUpVariables(data){
    let { params } = this.props.router;
    // console.log('params values ',params)
    let { page, limit } = params;
    let { selectedIds } = this.state;
    data.forEach((item)=>{
      if( selectedIds.indexOf(item.id) >= 0 ){
        item.selected = true;
      }else{
        item.selected = false;
      }
    });

    let _to = parseInt(page) * parseInt(limit);
    let _from = _to - limit;
    let _x = _to - _from;
    let _canGoNext = true;
    let _canGoPrev = true;
    if( data.length < _x ){
      _to = _from + data.length;
      _canGoNext = false;
    }
    if( page == 1 ){
      _canGoPrev = false;
    }
    let __f = data.length > 0 ? (_from + 1) : 0;
    this.setState({
      rows : data,
      pg_from : __f,
      pg_to : _to,
      canGoNext : _canGoNext,
      canGoPrev : _canGoPrev,
      isDataLoaded : true
    });
  }
  contructTds(row){
    let { columns, mainUrl } = this.props;
    let moreInfoUrl = mainUrl+'moreinfo/'+row.id;
    return columns.map(( item, idx ) => {
      return (
        <td key = { idx }>
          <Link to = { moreInfoUrl } >
            { ( row[ item ] )}
          </Link>
        </td>
      )
    })    
  }
  chxboxOnChange(item, ev){
    let { rows, selectedIds } = this.state;
    item.selected = ev.target.checked;
    if( ev.target.checked ){
      selectedIds.push( item.id );
    }else{
      let idx = selectedIds.indexOf(item.id);
      selectedIds.splice(idx, 1);
    }
    this.setState({rows : rows, selectedIds : selectedIds});
  }
  contructRows(){
    let { rows, pg_from } = this.state;
    let lmt = this.getLimitParams();
    let pg = this.getCurrentPage();
    if( rows.length ){
      return rows.map((item, idx) => {
        let num = ( (pg_from) + idx);
        let tds = this.contructTds(item);
        return (
          <tr key = { idx }>
            <td>{num}</td>
            <td>
              <input type = 'checkbox' checked = { item.selected } onChange = { this.chxboxOnChange.bind(this,item) }/>
            </td>
            { tds }
          </tr>
        )
      });
    }else{
      return (
        <tr>
          <td colSpan = '20'>No Results Found</td>
        </tr>
      )
    }
    
  }
  prevPage(){
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/'+this.getPrevPage() +'/'+ limit;
    this.props.router.push( _url );
    this.updateRows();
  }
  nextPage(){
    let { mainUrl } = this.props;
    let limit = this.getLimitParams();
    let _url = mainUrl + 'view/'+this.getNextPage() +'/'+ limit;
    this.props.router.push( _url );
    this.updateRows();
  }
  constructLimiter(){
    let limit = this.getLimitParams();
    return (
      <div className = 'hdr-lmtr'>
        <label> Limit </label>
        <select onChange = { this.changeLimit.bind(this) } value = { limit }>
          <option value = '10'>10</option>
          <option value = '20'>20</option>
          <option value = '30'>30</option>
          <option value = '40'>40</option>
          <option value = '50'>50</option>
        </select>
      </div>
    )
  }
  constructButtons(){
    let { pg_from, pg_to, canGoNext, canGoPrev } = this.state;
    return (
      <div className = 'hdr-page-ctrl'>
        <button onClick = { this.prevPage.bind( this ) } disabled = { ( !canGoPrev ) } className = 'prev-pg'>Prev</button>
        <span className = 'pg'>
          <span className = 'pg-from'>{pg_from}</span> - <span className = 'pg-to'>{pg_to}</span>
        </span>
        <button onClick = { this.nextPage.bind( this ) } disabled = { ( !canGoNext ) } className = 'nxt-pg'>Next</button>
      </div>
    )
  }
  onClickAddHandler(){
    let { mainUrl } = this.props;
    this.props.router.push( mainUrl + 'add' );

  }
  onClickDelBtn(){
    let { selectedIds, rows } = this.state;
    let { QDeleteUrl } = this.props;
    axios.post( QDeleteUrl , { 'ids' : selectedIds } )
      .then((rs)=>{
        // console.log( 'trying to delete selected ids ', selectedIds );
        if( rs.data.message == 'success'){
          this.updateRows();
        }
      })
  }
  constructMoreButton(){
    return(
      <div>
        <button onClick = { this.onClickDelBtn.bind(this) }>Del</button>
        <button onClick = { this.onClickAddHandler.bind(this) }>Add</button>
      </div>
    )
  }
  searchOnChange(ev){
    let visibility = true;
    if( ev.target.value != '' ){
      visibility = false;
    }
    this.setState({
      searchKey:ev.target.value,
      isDataLoaded : visibility
    })
  }
  searchOnKeyPress(ev){
    if( ev.which == 13 ){
      this.updateRows();
    }
  }
  onClickClearBtn(){
     
  }
  constructHeader(){
    let { tbl_hdr, colSizes } = this.props;
    if( tbl_hdr != undefined ){
      return tbl_hdr.map((item,idx)=>{
        let size = '';
        if( colSizes !== undefined ){
          size = colSizes[ idx ];
        }
        return( <th key = { idx } className = {('s'+size)}> { item } </th> )
      })
    }else{
      let { columns } = this.props;
      return columns.map((item,idx)=>{
        let size = '';
        if( colSizes !== undefined ){
          size = colSizes[ idx ];
        }
        return ( <th key = { idx } className = {('s'+size)}> { item } </th> )
      })
    }
  }
  render(){
    let { isDataLoaded, searchKey } = this.state;
    let rows = ''
    let btns = '';
    let lmtr = '';
    let content = '';
    let moreBtn = '';
    let tbl_hdrs = '';
    if( isDataLoaded ){
      tbl_hdrs = this.constructHeader();
      rows = this.contructRows();
      btns = this.constructButtons();
      lmtr = this.constructLimiter();
      moreBtn = this.constructMoreButton();
      content = (
        <div>
          
          <div className = 'tbl-hdr'>
            {moreBtn}
            {lmtr}
            {btns}
          </div>
          <table className = 'tbl'>
            <thead>
              <tr>
                <th> # </th>
                <th></th>
                { tbl_hdrs }
              </tr>
            </thead>
            <tbody>
              { rows }
            </tbody>
          </table>
        </div>
      );
    }else{
      content = ( <div> Waiting . . . </div> );
    }
    
    return(
      <div>
        <div>
          <input 
            type = 'text' 
              value = { searchKey } 
                onChange = { this.searchOnChange.bind(this) }
                  onKeyPress = { this.searchOnKeyPress.bind(this) }
                    placeholder = 'Search'/>
        </div>
        { content }
      </div>
    )
  }
}
*/