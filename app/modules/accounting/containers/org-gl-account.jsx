import React from 'react';
import Table from '../../common/containers/table';

export default class OrgGLAccount extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let _url = this.props.location;
    let cols = [ 'party__description', 'gl_account__description', 'accounting_period__code', 'from_date', 'thru_date' ];
      // console.log('Router value',)
    return(
      <div>
        <Table updateUrl = { _url }
          mainUrl = 'accounting/orgglaccount/'
            QUrlList = 'accounting/getallorgglaccount/'
              QDeleteUrl = 'accounting/deleteorgglaccount/'
                QSearchUrl = 'accounting/searchorgglaccount/'
                  columns = { cols }
                    router = { this.props.router }
                      tbl_hdr = {([ 'Party', 'Chart of Account', 'Accounting Period', 'From', 'Thru' ])}/>
      </div>
    )
  }
}