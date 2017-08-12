import React from 'react';
import Table from '../../common/containers/table';

export default class AccountingPeriod extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let _url = this.props.location;
    let cols = [ 'code', 'description', 'period_type__description', 'from_date', 'thru_date' ];
      // console.log('Router value',)
    return(
      <div>
        <Table updateUrl = { _url }
          mainUrl = 'accounting/acctgperiod/'
            QUrlList = 'accounting/getallacctgperiod/'
              QDeleteUrl = 'accounting/deleteacctgperiod/'
                QSearchUrl = 'accounting/searchacctgperiod/'
                  columns = { cols }
                    router = { this.props.router }
                      tbl_hdr = {([ 'Code', 'Description', 'Period', 'From', 'Thru' ])}/>
      </div>
    )
  }
}