import React from 'react';
import TabView from '../../common/containers/tab-view';

import { inject, observer } from 'mobx-react';

import Row from 'muicss/lib/react/row';


@inject('tabTableStore') @observer
export default class PersonView extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    let getAllObjUrlWithSomeInfo = 'party/getallperson/';
    let getAllObjCountUrl = 'party/getallpersoncount/';
    let getAllObjUrlWithAllInfo = 'party/getallinfo/';
    let saveNewInfoUrl = 'party/savenewinfo/';
    let getObjInfoUrl = 'party/getinfo/';
    let saveNewEntryUrl = 'party/savenewentry/';
    let deleteEntryUrl = 'party/deleteselected/';
    let searchEntryUrl = 'party/searchonparty';
    this.props.tabTableStore.setUpUrls(
      getAllObjUrlWithSomeInfo, 
        getAllObjUrlWithAllInfo, 
          getAllObjCountUrl,
            saveNewInfoUrl,
              getObjInfoUrl,
                saveNewEntryUrl,
                  deleteEntryUrl,
                    searchEntryUrl );
  }
  render(){
    let { tabTableStore } = this.props; // store
    let content = '';
    if( tabTableStore.isUrlSetup ){
      let tabLabel = [ 'first_name', 'last_name' ]; // use to show on tab title
      let listHeaderLabel = [ 
        { name : 'last_name', type : 'text' }, 
        { name : 'middle_name', type : 'text' }, 
        { name : 'first_name', type : 'text' }, 
        { name : 'suffix', type : 'text' } 
      ];
      let infoOnView = [  
        { name : 'first_name', type : 'text' }, 
        { name : 'last_name', type : 'text' }, 
        { name : 'middle_name', type : 'text' }, 
        { name : 'suffix', type : 'text' },
        { 
          name : 'status_id', 
          type : 'select', 
          getAllFkUrl : 'party/getpersonstatuses/',
          getFkUrl : 'party/getpersontatus/',
          labelCol : 'description',
          idKey : 'id',
          isBigData : true
        }
      ];
      // auto complete with url
      content = (
        <TabView key = { 'tabTableStore'}
          givenStore = { tabTableStore }
            location = { this.props.location } 
              listHeaderLabel = { listHeaderLabel } 
                tabLabel = { tabLabel }
                  viewInfoHeader = { ( [ 'last_name', 'first_name' ] ) } 
                    infoOnView = { infoOnView }/>
      )
    }
    
    return(
      <Row>
        { content }
      </Row>
    )
  }
}

/*
viewInfoHeader
  - these column are shown on edit, view info title
infoOnView
  - use to define which info is shown during viewing of the info of data
tabLabel
  - use to define what column is shown in the tab title
listHeaderLabel
  - use to define the columns that can be seen on the table 
  - it's also define the filter available when using the search input
location
  - variable of react-router
givenStore
  - store
*/
