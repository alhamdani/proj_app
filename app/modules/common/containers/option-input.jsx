import React from 'react';

export default class OptionInput extends React.Component{
    constructor(props){
        super(props);
    }
    constructOptions(){
        let { OptList } = this.props;
        let _arr = [];
        _arr.push(
            <option value = '' disabled key = 'disableOption'>Select</option>
        )
        OptList.forEach((item, idx)=>{
            _arr.push(
                <option key = { idx } value = {item.value}>{item.label}</option>
            )
        })

       return _arr;
       
    }
    onChangeHandler(ev){
        let { value, dbCol } = this.props;
        let new_value = ev.target.value;
        this.props.updaterFn(dbCol, new_value, true);
    }   

    render(){
        let { value, label, extraClass } = this.props;
        let options = this.constructOptions();
        let cls = 'ipt opt-ipt ';
        if( extraClass !== undefined ){
            cls += extraClass;
        }
        return(
            <div className = { cls }>
                <label>{ label }</label>
                <select onChange={this.onChangeHandler.bind(this)} value = { value }>{ options }</select>
            </div>
        )
    }
}