import React from 'react';
import Table from '../../../common/containers/table';

export default class RecievingReport extends React.Component{
  render(){
    let _url = this.props.location;
    let cols = ['first_name', 'last_name'];
    return(
      <div>
        Recieving Report
        <div>
          <Table updateUrl = { _url }
            mainUrl = 'master/party/person/'
              QUrlList = 'getallpersononrange/'
                QDeleteUrl = 'deleteselectedperson/'
                  columns = { cols }
                    router = { this.props.router }/>
        </div>
      </div>
    )
  }
}