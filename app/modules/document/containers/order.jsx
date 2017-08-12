import React from 'react';
import Table from '../../common/containers/table';

export default class OrderHeader extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    let _url = this.props.location;
    let cols = [ 'doctype__description', 'party__description', 'location__description', 'docdate', 'statusname' ];
      // console.log('Router value',)
    return(
      <div>
        <Table updateUrl = { _url }
          mainUrl = 'documents/order/'
            QUrlList = 'documents/getalldocumentheader/'
              QDeleteUrl = 'documents/deletedocumentheader/'
                QSearchUrl = 'documents/searchdocumentheader/'
                  columns = { cols }
                    router = { this.props.router }
                      tbl_hdr = {([ 'Document Type', 'Customer/Supplier', 'Location', 'Document Date', 'Status' ])}/>
      </div>
    )
  }
}