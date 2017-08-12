import React from 'react';
import { observer, inject } from 'mobx-react';

import AppTableComponent from '../../common/containers/app-table';
import AppFormComponent from '../../common/containers/app-form';
import AppTab from '../../common/containers/app-tab';

@inject('appTab', 'userAccess') @observer
export default class AllEmployeeComponent extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.userAccess.checkAndRedirectIfNone(this);
        let accessCode = this.props.userAccess.access_key_code;
        let inputs_def = {
            isEditing : true,
            inputs : [
                {
                    type : 'text', 
                    label : 'First name',
                    dbCol: 'first_name',
                    value : 'abufirash'
                },{ 
                    type : 'text', 
                    dbCol : 'last_name',
                    label : 'Last name',
                    value : 'abdulhamid'
                },{
                    type : 'lookup',
                    // use when typing on input
                    queryUrl : 'getallpartyonrange/', 
                    // postcondition : return { 'label : 'string', 'value' : 'string' }
                    // use when clicked on tr
                    getInfoUrl : 'getpartyinfo/', 
                    // this will be used when changes is made on the input
                    colToUse : 'id',
                    // column on the model
                    dbCol : 'party_id',
                    label : 'Party',
                    value : ''
                },{
                    type : 'lookup',
                    queryUrl : 'getallroletypeonvalue/',
                    getInfoUrl : 'getroletypeinfo/',
                    colToUse : 'id',
                    dbCol : 'roletype_master_id',
                    label : 'Roletype',
                    value : ''
                },{
                    type : 'option',
                    label : 'Marital Status',
                    options : [
                        { label : 'Devorse', value : 'devorse' },
                        { label : 'Widow', value : 'widow' },
                        { label : 'Married', value : 'married' },
                        { label : 'Single', value : 'single' }
                    ],
                    dbCol : 'marital_status',
                    label : 'Marital Status',
                    value : 'married'
                }
            ]
        };
        // note : be sure that QListUrl will return all the fields you define on inputDef
        // QSearchCount return { counted : number }
        let _arr = [
            {
                tab_title : 'Abs new Title',
                tab_component : (
                     <AppTableComponent 
                        formHeaderText = 'Employee'
                            cols = { ( [ 'first_name', 'last_name' ] ) }
                                QlistUrl = 'getemployeeonrange/' 
                                    QCountAllUrl = 'getemployeecount/'
                                        QSearchCount = 'countsearchemployee/'
                                            QUpdateData = 'updateemployee/'
                                                QAddData = 'savenewemployee/'
                                                    QDeleteData = 'deleteemployee/'
                                                        inputDef = { inputs_def }
                                                            LinkEditUrl = ''
                                                                AddEditUrl = '' 
                                                                    keyCode = { accessCode } />
                )
            },
            {
                tab_title : 'New Tab',
                tab_component : ( <div>New COmponent</div>)
            }
        ];
        _arr.forEach((el)=>{
            this.props.appTab.addTab( el );
        })
    }
    render(){
        return (
            <div>
                <AppTab/>
            </div>
        )
    }
}