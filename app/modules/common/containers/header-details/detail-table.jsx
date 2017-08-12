import React from 'react';
import {Link} from 'react-router';
import { inject, observer } from 'mobx-react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const FA = require('react-fontawesome');

import TableCheckbox from './table-checkbox';
import CommonInput from './common-input';
import LookupInput from './table-lookup';
import TextOnly from './table-text-only';
import TableInputSelect from './table-input-select';

@inject( 'headerDetails' ) @observer
export default class DetailTable extends React.Component{
  constructor(props){
    super(props);
  }
  toggleAllSelected(){
    this.props.headerDetails.toggleAllSelected();
  }
  constructHdr(){
    let isAllSelected = this.props.headerDetails.isAllSelected;
    let data_on_active = this.props.headerDetails._data_on_active_tab;
    let columns = this.props.headerDetails._active_tabs['cols'];
    if( columns !== undefined ){
      let hdr = [];
      let chxBox = '';
      if( data_on_active.length ){
        chxBox = ( <input type = 'checkbox' checked = { isAllSelected } onChange = { this.toggleAllSelected.bind(this) }/> )
      }
      hdr.push(
        <th key = 'chxbox'>
          { chxBox }
        </th> )

      columns.forEach((item, idx)=>{
        hdr.push(<th key = { idx }>{item.label}</th>)
      })
      return hdr;
    }else{
      console.log('no header define')
      return '';
    }
  }
  toggleIsSelected( row_idx ){
    this.props.headerDetails.toggleIsSelected( row_idx );
  }
  isSelected( row_idx ){
    let { idx_selected } = this.props.headerDetails;
    return idx_selected.indexOf( row_idx ) >= 0 ? true : false;
  }
  constructTds( row, row_idx ){
    let active_tab = this.props.headerDetails._active_tabs;
    let columns = active_tab['cols'];
    let tds = [];
    let isEditing = this.props.headerDetails.editingOnDetails;
    // row can be undefined when deleting rows
    if( columns && row ){ // if row and columns is not undefined
      if( row.toAdd !== undefined ){
        isEditing = false;
      }
      tds.push(
        <td key = 'chxbox'>
          <input type = 'checkbox' 
            checked = { ( this.isSelected( row_idx ) ) } 
              onChange = { this.toggleIsSelected.bind(this, row_idx) }/>
        </td> )
      columns.forEach((item,idx)=>{
        if( item.type == 'input' || item.type == 'date' ){
          tds.push( 
            <td key = { idx }> 
              <CommonInput Type = { item.type } 
                value = { row[ item.name ] }
                  ColName = { item.name } 
                    RowIdx = { row_idx } isForAdding = { row.toAdd }/> 
            </td> );
        }else if( item.type == 'text' ){
          if( active_tab[ 'relations'] !== undefined ){
            let formula_list = active_tab['relations'];
            tds.push(
              <td key = { idx }>
                <TextOnly 
                  Relations = { active_tab[ 'relations'][ item.name ] }
                    Name = { item.name }
                      Formula = { formula_list[item.name].formula } Row = { row }
                        DecimalPlace = { formula_list[item.name].decimal_place }/>
              </td>
            )
          }else{
            tds.push( <td key = { idx }> - - </td> ) 
          }
        }else if( item.type == 'select' ){
          tds.push( 
            <td key = { idx }>
              <TableInputSelect Name = { item.name } 
                Value = { row[ item.name ].default_value } RowIdx = { row_idx }
                  isForAdding = { row.toAdd }/>
            </td> )
        }else if( item.type == 'lookup' ){
          let { onLookups } = active_tab;
          let _choices = [];
          let data = row[ item.name ];
          let url = onLookups[item.name].url;
          tds.push( 
            <td key = { idx } className = 'wt-lookup'>
              <LookupInput 
                dataObj = { data } 
                  Url = { url } RowIdx = { row_idx } 
                    ColName = { item.name } isForAdding = { row.toAdd } />
            </td> );
        }else if( item.type == 'plain_text' ){
          tds.push( <td key = { idx }>{row[item.name]}</td>)
        }else{
          tds.push( <td key = { idx }></td> )
        }
      });
    }
    return tds;
  }
  
  constructRows(){
    let isLoaded = this.props.headerDetails.isLoaded;
    
    if( isLoaded ){
      let data_on_active = this.props.headerDetails._data_on_active_tab;
      if( data_on_active !== undefined ){
        let _rows = [];
        if( data_on_active.length ){
          // console.log(' -  -  -  -  -')
          // console.log(data_on_active, data_on_active.length);
          data_on_active.forEach((item,idx)=>{
            
            let tds = '';
            tds = this.constructTds( item, idx );
            _rows.push(
              <tr key = { idx }>
                { tds }
              </tr>)
          })
          // console.log(' -  -  -  -  -')
        }else{
          _rows.push(
            <tr key = 'no_data'>
              <td colSpan = '100'>No Records</td>
            </tr>
          )
        }
        return _rows;
      }else{
        console.log('data_on_active is not define')
      }
    }
  }
  render(){
    let isDataLoaded = this.props.headerDetails.isDataOnActiveTabLoaded;
    
    let hdr = this.constructHdr();
    let rows = ( <tr><td colSpan = '20'> Loading . . . </td></tr> );
    if( isDataLoaded ){
      rows = this.constructRows();
    }
    return(
      <div className = 'dtl-tbl'>
        <table>
          <thead>
            <tr>{ hdr }</tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
        <br/>
        <br/>
      </div>
    )
  }
}

/*
=== on Select
updateSelectInput( row_idx, col, ev ){
    let value = ev.target.value;
    this.props.headerDetails.updateInputObjValue( value, row_idx, col );

    this.props.headerDetails.addIdxOnEdited( row_idx );
  }


  let { onOptions } = active_tab;
  let _choices = [];
  let data = row[ item.name ];
  try{
    onOptions[item.name].options.forEach((_item,_idx)=>{
      _choices.push(
        <option key = { _idx } value = { _item.value }>{ _item.label }</option>
      )
    })
  }catch(e){}
  tds.push( 
    <td key = { idx }>
      <div>
        <select 
          value = { data.default_value } 
            onChange = { this.updateSelectInput.bind(this, row_idx, item.name ) } 
              disabled = {( isEditing )}>
          { _choices }
        </select>
      </div>
    </td> )  

=== on Select


  updateLookupInput( row_idx, col, ev ){
    let value = ev.target.value;
    this.props.headerDetails.updateInputObjValue( value, row_idx, col, true );
  }
  constructCommonInput( value, row_idx, col ){ // may not be needed anymore
    let isEditing = this.props.headerDetails.editingOnDetails;
    return ( 
      <input 
        value = { value } 
          type = 'text'
            onChange = { this.updateInput.bind(this, row_idx, col) } disabled = { ( isEditing ) } /> );
  }
 updateInput( row_idx, col, ev ){
    let value = ev.target.value;
    this.props.headerDetails.updateInputValue( value, row_idx, col );
  }
onChangeInput( row_idx, ev ){
    let { name, value } = ev.target;
    this.props.headerDetails.updateInputValue( value, row_idx, name );
  }
makeCheckbox( row, row_idx ){
    return(
      <input type = 'checkbox'
        checked = { row.isSelected } 
          onChange = { this.toggleIsSelected.bind(this, row_idx) }/>
    )
  }
makeCommonInput( row, col, row_idx ){
    let value = row[ col ];
    return(
      <input type = 'text' 
        name = { col }
          value = { value } 
            onChange = { this.onChangeInput.bind(this, row_idx ) }/>
    )    
  }
  constructTds2( row, row_idx ){
    let active_tab = this.props.headerDetails._active_tabs;
    let columns = active_tab['cols'];
    let tds = [];
    let { editingOnDetails } = this.props.headerDetails;
    if( columns && row ){ // if columns is define on the current active tab
      // add checkbox for first column of each row
      tds.push( <td key = 'chxbox'>{ ( this.makeCheckbox( row, row_idx ) ) }</td> );
      columns.forEach( (item, idx) => {
        if( item.type == 'input' ){
          let value =  row[ item.name ];
          if( editingOnDetails || row.toAdd ){ // if editing state or a row for adding new entry
            tds.push(<td key = { idx }> { ( this.makeCommonInput( row, item.name, row_idx ) ) } </td> );
          }else{
            tds.push( <td key = { idx }>{ value }</td> );
          }
        }else if( item.type == 'lookup' ){
          let { onLookups } = active_tab;
          let _choices = [];
          let data = row[ item.name ];
          let url = onLookups[item.name].url;
          tds.push( 
            <td key = { idx } className = 'wt-lookup'>
              <LookupInput dataObj = { data } Url = { url } RowIdx = { row_idx } ColName = { item.name } isForAdding = { row.toAdd } />
            </td> );
        }else{
          tds.push( <td key = {idx}> - - </td>)
        }
      })
      return tds;
    }
  }
*/

/*
  updateLookupOptions( name, val ){
    // console.log(name);
    let { onLookups } = this.props;
    let { url } = onLookups[name];
    
    axios.get(url, { params : { 'keyCode' : val } } )
      .then((rs)=>{
        let { options } = rs.data.qs;
        onLookups[name].options = options;
        this.props.updateInputValue();
      })
    
  }
  onChangeInput( col, row, ev ){
    if( col.type == 'lookup' ){ // when lookups
      let val = ev.target.value;
      row[ col.name ].isOptionVisible = true;
      row[ col.name ].label = val;
      this.updateLookupOptions(col.name, val);
    }else if( col.type == 'select' ){
      let val = ev.target.value;
      row[ col.name ].default_value = val;
      this.props.updateInputValue();
    }else{
      row[col.name] = ev.target.value;
      this.props.updateInputValue();
    }
  }
  blurOnLookup( col, row ){
    row[ col.name ].isOptionVisible = false;
    this.props.updateInputValue();
  }
 selectOnLookup( col, row, new_val ){
    row[ col.name ].label = new_val.label;
    row[ col.name ].default_value = new_val.value;
    this.props.updateInputValue();
  }
  ructInputs( row ){
    let { data_on_active } = this.props;
    let { columns } = this.props;
    let tds = [];
    // console.log(row)
    tds.push(
      <td key = 'chxbox'>
        <input type = 'checkbox' onChange = { this.props.toggleIsSelected.bind(this, row) } checked = { row.isSelected } />
      </td>)
    columns.forEach((item,idx)=>{
      let size = 25;
      let _input = '';
      if( item.size !== undefined ){
        size = item.size * 10;
      }
      if( item.type == 'input' ){
        // console.log(item.type, item.name);
        tds.push(
          <td key = { idx }>
            <input type = 'text' size = {size} value = { row[ item.name ]} onChange = { this.onChangeInput.bind(this, item, row ) }/>
          </td>)
      }else if( item.type == 'text' ){
        // console.log(row);
        let formula = '';
        try{
          formula = this.props.formulas[item.name].formula;
          for( let key in row ){ // get the columns on the formula
            if( formula.indexOf(key) >= 0 ){
              if( row[key] != '' ){
                formula = formula.replace(key, row[key]);
              }
            }
          }
        }catch(e){
          console.log('there is a problem on formula');
        }
        
        try{
          let result = eval(formula);
          let decimals = this.props.formulas[item.name].decimal_place
          let roundedUpValue = Number(Math.round(result+'e'+decimals)+'e-'+decimals);
          tds.push(
            <td key = { idx }>{roundedUpValue}</td>
          )
          row[item.name] = roundedUpValue;
        }catch(e){
          tds.push(
            <td key = { idx }> - - </td>
          ) }
      }else if( item.type == 'select' ){
        console.log('select', )
        let { onOptions } = this.props;
        let data = row[ item.name ];
        // console.log()
        let _choices = [];
        try{
          onOptions[item.name].options.forEach((_item,_idx)=>{
            _choices.push(
              <option key = { _idx } value = { _item.value }>{ _item.label }</option>
            )
          })
        }catch(e){}
        // console.log(row[ item.name ])
        tds.push( 
          <td key = { idx }>
            <div>
              <select value = { data.default_value } onChange = { this.onChangeInput.bind(this, item, row ) }>
                { _choices }
              </select>
            </div>
          </td> )
      }else if( item.type == 'lookup' ){
        // console.log(item.type);
        let { onLookups } = this.props;
        let _choices = [];
        try{
          let _row = row[item.name];
          onLookups[item.name].options.forEach((_item,_idx)=>{
            if( _item.value == _row.value ){
              _choices.push(
                <li key = { _idx } className = 'active' onMouseDown = { this.selectOnLookup.bind( this, item, row ) }>
                  { _item.label }
                </li>
              )
            }else{
              _choices.push(
                <li key = { _idx } 
                  onMouseDown = { this.selectOnLookup.bind( this, item, row, _item ) }>
                    { _item.label }
                </li>
              )
            }
          })
        }catch(e){}
        let data = row[ item.name ];
        tds.push(
          <td key = { idx } className = 'wt-lookup'>
            <input type = 'text' 
              value = { data['label'] } 
                onChange = { this.onChangeInput.bind(this, item, row ) } 
                  onBlur = { this.blurOnLookup.bind(this, item, row )}/>
            <div className = 'td-lookup-body' style = { ({ display : data['isOptionVisible'] ? 'block' : 'none' })}>
              <ul>
                { _choices }
              </ul>
            </div>
          </td>
        )
      }
    });
    return tds;
  }
*/