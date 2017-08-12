import React from 'react';
import { observer, inject } from 'mobx-react';
import LookUpInput from './lookup-input';
import CommonInput from './common-input';
import OptionInput from './option-input';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

@inject( 'appForm', 'appTable') @observer
export default class AppFormComponent extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        let { inputs } = this.props.inputDef;
        let { formHeaderText } = this.props;
        this.props.appForm.setUpInputs( inputs );
        this.props.appForm.setHeaderTitle( formHeaderText );
    }
    commonInputOnChange(col, ev){
        this.props.appForm.updateInput( col, ev.target.value );
    }
    constructCommonInput( el ){
        return (
            <div key = { el.dbCol }>
                <label> { el.label }</label>
                <input 
                    type = { el.type } 
                        value = { el.value }
                            onChange = { this.commonInputOnChange.bind(this, el.dbCol) }/>
            </div>
        )
    }
    updateInputFn( col, value, haveOtherInfo ){
        this.props.appForm.updateInput(col, value, haveOtherInfo);
    }
    constructForm(){
       let { _inputs } = this.props.appForm;
       let _w = [];
       for( let key in _inputs ){
            let item = _inputs[key];
            if( item.type == 'lookup'){
                let value = item.value.replace(/\s+/g,' ').trim()
                _w.push(
                    <LookUpInput 
                        key = { key } 
                            value = { value }
                                queryUrl = { item.queryUrl }
                                    dbCol = { item.dbCol }
                                        colToUse = { item.colToUse }
                                            label = { item.label }
                                                updaterFn = { this.updateInputFn.bind(this) }
                                                    extraClass = 'ipt-bl'/>);
            }else if( item.type == 'text' ){
               _w.push(
                    <CommonInput 
                        key = { key } 
                            value = { item.value } 
                                label = { item.label }
                                    dbCol = { item.dbCol }
                                        updaterFn = { this.updateInputFn.bind(this) }/>);
            }else if( item.type == 'option'){
                _w.push(
                    <OptionInput 
                        value = { item.value } 
                            key = { key } 
                                label = { item.label }
                                    OptList = { item.options }
                                        dbCol = { item.dbCol }
                                            updaterFn = { this.updateInputFn.bind(this) }/>);
            }
       }
       return _w;
    }
    saveBtn(){
        this.props.appForm.saveNewData();
    }
    cancelBtn(){
        this.props.appForm.isVisible = false;
        this.props.appTable._isVisible = true;
    }
    render(){
        let { isVisible, headerTitle } = this.props.appForm;
        let form = this.constructForm();
        return (
            <div style = { ( { display : isVisible ? 'block' : 'none' } ) } className = 'ap-4rm-cnr'>
                <h5 className = 'hdr-4rm'>{ headerTitle }</h5>
                <form className = 'ap-4rm'>
                    <div className = 'ipt-fields'>
                        { form }
                    </div>
                    <div className = 'btns'>
                        <button className = 'drk' onClick = { this.saveBtn.bind(this) } type = 'button'>Save</button>
                        <button className = 'lyt' onClick = { this.cancelBtn.bind(this) } type = 'button'>Cancel</button>
                    </div>
                </form>
                <br/>
                <br/>
            </div>
        )
    }
}



/*

    - - - - code with reactJS state - - - -
    import React from 'react';

    export default class AppFormComponent extends React.Component{
        constructor(props){
            super(props);
            this.state = { formInput : {} };
        }
        componentDidMount(){
            let { formInput } = this.state;
            let { inputs } = this.props.inputDef;
            inputs.forEach(function(el){
                formInput[el.dbCol] = el;
            })
            this.setState({formInput : formInput});
        }
        onChangeHandler( key, ev ){
            let { formInput } = this.state;
            formInput[key].value = ev.target.value;
            this.setState({formInput : formInput });
        }
        constructForm(){
        let { formInput } = this.state;
        let content = [];
        for( let key in formInput ){
            let el = formInput[key];
            if( el.type == 'lookup' ){
                    content.push(
                        <div>
                            <label>{el.label}</label>
                            <input type = 'text' />
                            <div>

                            </div>
                        </div>
                    )
            }else{
                    content.push(
                        <div key = { key }>
                            <label>{el.label}</label>
                            <input 
                                    type = { el.type } 
                                        value = { el.value } 
                                            onChange = { this.onChangeHandler.bind(this, key) }/>
                        </div> )
            }
            
        }
        return content;
        }
        render(){
            let form = this.constructForm();
            return (
                <div>
                    Form
                    { form }
                </div>
            )
        }
    }
    class FormInputComponent extends React.Component{
        render(){
            
            return(

            )
        }
    }
*/