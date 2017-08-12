import React from 'react';
import Table from '../../../common/containers/table';

export default class AccessLevel extends React.Component{
  render(){
    let _url = this.props.location;
    let cols = [ 'full_name', 'group' ];
    return(
      <div>
        Access Level
        <div>
          <Table updateUrl = { _url }
            mainUrl = 'security/accesslevel/'
              QUrlList = 'getallpersonaccesslevel/'
                QDeleteUrl = 'deleteselectedperson/'
                  QSearchUrl = 'searchpersononaccesslevel/'
                    columns = { cols }
                      router = { this.props.router }
                        tbl_hdr = {([ 'Name', 'Group' ])}/>
        </div>
      </div>
    )
  }
}