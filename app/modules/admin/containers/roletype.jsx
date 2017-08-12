import React from 'react';
import {observer, inject } from 'mobx-react';

import AppTableComponent from '../../common/containers/app-table';
@inject('userAccess') @observer
export default class Roletype extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.userAccess.checkAndRedirectIfNone(this);
    }
    render(){
        
        let inputs_def = {
            inputs : [
                { 
                    type : 'text', 
                    label : 'Description',
                    dbCol: 'description',
                    value : 'value'
                }
            ]
        }
            
        let accessCode = this.props.userAccess.access_key_code;
        return (
            <div>
                <AppTableComponent 
                    formHeaderText = 'Roletype'
                        cols = { ( [ 'description' ] ) }
                            QlistUrl = 'getroletypeonrange/' 
                                QCountAllUrl = 'countallroletype/'
                                    QSearchCount = 'countsearchedroletype/'
                                        QUpdateData = ''
                                            QAddData = ''
                                                QDeleteData = ''
                                                    inputDef = { inputs_def }
                                                        LinkEditUrl = ''
                                                            AddEditUrl = '' 
                                                                keyCode = { accessCode } />
            </div>
        )
    }
}