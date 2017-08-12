import React from 'react';
import Table from '../../common/containers/table';

export default class ChartOfAccounts extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let _url = this.props.location;
    let cols = [ 'code', 'description', 'details', 'account_type__description' ];
      // console.log('Router value',)
    return(
      <div>
        <Table updateUrl = { _url }
          mainUrl = 'accounting/chartofaccount/'
            QUrlList = 'accounting/getallglaccount/'
              QDeleteUrl = 'accounting/deleteglaccount/'
                QSearchUrl = 'accounting/searchglaccount/'
                  columns = { cols }
                    router = { this.props.router }
                      tbl_hdr = {([ 'Code', 'Description', 'Details', 'Type' ])}/>
      </div>
    )
  }
}