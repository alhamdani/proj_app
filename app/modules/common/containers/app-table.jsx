import React from 'react';
import { observer, inject } from 'mobx-react';

import AppFormComponent from './app-form';
const FA = require('react-fontawesome');

@inject( 'appTable', 'appForm' ) @observer
export default class AppTableComponent extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        let urls = {};
        let _q = this.props;
        urls['listQuery'] = _q.QlistUrl;
        urls['countQuery'] = _q.QCountAllUrl;
        urls['searchCountUrl'] = _q.QSearchCount;
        
        this.props.appTable.setUpUrls(urls);
        this.props.appTable.setUpColumns(_q.cols);
        this.props.appTable.queryOnRange();
        this.props.appTable.queryCount();
    }
    changeStatus( row ){
        let { isSelected } = row;
        let value = !isSelected
        row.isSelected = value;
        let { _selectedCount, _rows } = this.props.appTable;
        if( value ){
            _selectedCount += 1;
        }else{
            _selectedCount -= 1;
        }
        this.props.appTable._selectedCount = _selectedCount;
        if( _selectedCount == _rows.length ){
            this.props.appTable._isAllSelected = true;
        }else{
            this.props.appTable._isAllSelected = false;
        }
    }
    toogleSelectAll(){
        let { _rows, _isAllSelected } = this.props.appTable;
        _rows.forEach((item)=>{ 
            let { isSelected } = item;
            item.isSelected = !_isAllSelected;
        })
        this.props.appTable._isAllSelected = !_isAllSelected;
    }
    constuctTd(row){
        let { cols } = this.props;
        let { isSelected } = row;
        let temp_arr = [];
        temp_arr.push(
            <td key = 'cxbox-td' className = 'cxbox-td'>
                <input 
                    checked = { isSelected } 
                        onChange = { this.changeStatus.bind(this,row) } 
                            type = 'checkbox'/>
            </td>
        );
        cols.forEach((el, idx)=>{
            temp_arr.push(<td key = { idx }>{ row[ el ] }</td>);
        })
        return temp_arr;
    }
    dblClickedRow(obj){
        let { formHeaderText } = this.props;
        this.props.appForm.isVisible = true;
        this.props.appForm.isEditing = true;
        this.props.appForm.headerTitle = 'Edit ' + formHeaderText;
        this.props.appForm.updateAllInput(obj);
        this.props.appTable._isVisible = false;
    }
    constructRow(){
        let { _rows } = this.props.appTable;
        let temp_arr = [];
        if( _rows.length ){
            _rows.forEach((el,idx)=>{
                let tds = this.constuctTd(el)
                temp_arr.push(
                    <tr key = { idx } onDoubleClick = { this.dblClickedRow.bind(this, el) }>
                        { tds }
                    </tr>
                )
            })
        }else{
            temp_arr.push(
                <tr key = 'nothing-to-show' style = {({textAlign : 'center'})}>
                    <td colSpan = '20'>Nothing to show</td>
                </tr>
            )
        }
        return temp_arr;
    }
    constructHeader(){
        let { cols } = this.props;
        let { _isAllSelected } = this.props.appTable;
        let temp_arr = [];
        temp_arr.push(
            <th key = 'blank-td' className = 'blank-td'>
                <input 
                    type = 'checkbox' 
                        checked = { _isAllSelected } 
                            onChange = { this.toogleSelectAll.bind(this) }/>
            </th>);
        cols.forEach((el,idx)=>{
            let splitLbl = el.split('_');
            let lbl = '';
            splitLbl.forEach( ( el, idx ) => {
                lbl += el + ' ';
            })
            temp_arr.push(<th key = { idx }>{lbl}</th>);
        })
        return temp_arr;
    }
    constructPagination(){
        let _to = this.calcTo();
        let _from = this.calcFrom(_to);
        return (
            <div className = 'tbl-pgnxn'>
                <button className = 'btn-icn' onClick = { this.prevPage.bind(this) }>
                    <FA name = 'chevron-left'/>
                </button>
                <span>{ _from } - { _to }</span>
                <button className = 'btn-icn' onClick = { this.nextPage.bind(this) }>
                    <FA name = 'chevron-right'/>
                </button>
            </div>
        )
    }
    constructLimiter(){
        let { _limit } = this.props.appTable;
        return (
            <div className = 'tbl-lmtr'>
                <select value = { _limit } onChange = { this.changeLimit.bind(this) }>
                    <option value = '10'>10</option>
                    <option value = '20'>20</option>
                    <option value = '30'>30</option>
                    <option value = '40'>40</option>
                    <option value = '50'>50</option>
                </select>
            </div>
        )
    }
    keyPressOnGoto(ev){
        if( ev.which === 13 ){
            this.props.appTable.gotoPage( parseInt(ev.target.value) )
        }
    }
    goToChange(ev){
        let { value } = ev.target;
        this.props.appTable._current_page = value;
    }
    constructGotoInput(){
        let { _current_page, _max_page } = this.props.appTable;
        return (
            <div className = 'tbl-goto'>
                <input type = 'text' onChange = { this.goToChange.bind(this) } value = { _current_page } onKeyPress = { this.keyPressOnGoto.bind(this) } /> to { _max_page }
            </div>
        )
    }
    changeLimit(ev){
        this.props.appTable.changeLimit( ev.target.value );
    }
    nextPage(){
        this.props.appTable.nextPage();
    }
    prevPage(){
        this.props.appTable.prevPage();
    }
    calcFrom(_to){
        let { _limit } = this.props.appTable;
        let _q = ( _to - _limit );
        if( _q >= 0 ){
            return ( _to - _limit ) + 1;
        }else{
            return 1;
        }
    }
    calcTo(){
        let { _current_page, _limit, _counted_list } = this.props.appTable;
        let _q = _limit * _current_page;
        if( _q > _counted_list ){
            return _counted_list;
        }else{
            return _q;
        }
    }
    searchValue(ev){
        if( ev.which == 13 ){
            this.props.appTable.querySearch( ev.target.value );
        }
    }
    constructSearchBar(){
        return (
            <div className = 'tbl-search'>
                <input type = 'text' onKeyPress = { this.searchValue.bind(this) } />
            </div>
        )
    }
    refreshList(){
        console.log('refreshing');
    }
    isCanAdd(){
        return this.props.keyCode.indexOf('c') >= 0 ? true : false;
    }
    isCanView(){
        return this.props.keyCode.indexOf('r') >= 0 ? true : false;
    }
    isCanUpdate(){
        return this.props.keyCode.indexOf('u') >= 0 ? true : false;
    }
    isCanDelete(){
        return this.props.keyCode.indexOf('d') >= 0 ? true : false;
    }
    constructButtons(){
        let dl8btn = '', addbtn = '', rfshbtn = '';
        if( this.isCanDelete() ){
            dl8btn = (
                <button className = 'btn-icn' onClick = { this.deleteItem.bind(this) }>
                    <FA name = 'trash'/>
                </button>
            )
        }
        if( this.isCanAdd() ){
            addbtn = (
                <button className = 'btn-icn' onClick = { this.addItem.bind(this) }>
                    <FA name = 'plus'/>
                </button>
            )
        }
        if( this.isCanView() ){
            rfshbtn = (
                <button className = 'btn-icn' onClick = { this.refreshList.bind(this) }>
                    <FA name = 'refresh'/>
                </button>
            )
        }
        return (
            <div className = 'tbl-btns-axn'>
                { dl8btn }
                { rfshbtn }
                { addbtn }
            </div>
        )
    }
    deleteItem(){
        console.log('deleting')
        // this.props.appTable._isVisible = false;
    }
    addItem(){
        let { formHeaderText } = this.props;
        this.props.appForm.headerTitle = 'Add ' + formHeaderText;
        this.props.appForm.clearInputValues(); 
        this.props.appForm.isVisible = true;

        this.props.appTable._isVisible = false;
    }
    render(){
        let { _rows, _isLoaded, _searchKey, _isVisible } = this.props.appTable;
        let { cols, inputDef, formHeaderText } = this.props;
        let trs = [], theads = [], pgnxn = '', limiter = '', goToInput = '', searchInput = '', form = '', btns = '';
        let wholeContainer = (
            <div> Nothing to show contact Amesco Drug IT Support for details.</div>
        );
        //  
        if( _isLoaded && this.isCanView() ){
            theads = this.constructHeader();
            trs = this.constructRow();

            pgnxn = this.constructPagination();

            limiter = this.constructLimiter();
            goToInput = this.constructGotoInput();
            searchInput = this.constructSearchBar();
            form = ( <AppFormComponent inputDef = { inputDef } formHeaderText = { formHeaderText } /> );
            btns = this.constructButtons();

            wholeContainer = (
                 <div className = 'tbl-4rm-c'>
                    { form }
                    <div style = {({ display : _isVisible ? 'block' : 'none' })}>
                        <div className = 'tbl-hdr'>
                            <div className = 'tbl-hdr-c'>
                                { btns }
                                { searchInput }
                            </div>
                            <div className = 'tbl-hdr-p'>
                                { limiter }
                                { goToInput }
                                { pgnxn }
                            </div>
                        </div>
                        <div style = { ({ display : _searchKey === '' ? 'none' : 'block' })} >Search result of '{ _searchKey }'</div>
                        <table className = 'tbl'>
                            <thead>
                                <tr>
                                { theads }
                                </tr>
                            </thead>
                            <tbody>
                                { trs }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
        return(
           <div>{wholeContainer}</div>
        )
    }
}


    /*constructFooter(){
        let _to = this.calcTo();
        let _from = this.calcFrom(_to);
        return (
            <td colSpan = '20'>
                <button onClick = { this.prevPage.bind(this) }>Previous</button>
                <span>{ _from } - { _to }</span>
                <button onClick = { this.nextPage.bind(this) }>Next</button>
            </td>
        )
    }*/