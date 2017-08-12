import React from 'react';
import { observer, inject } from 'mobx-react';

export default class CommonInput extends React.Component{
    constructor(props){
        super(props);
    }
    updateInput(ev){
        let { value, dbCol } = this.props;
        let new_value = ev.target.value;
        this.props.updaterFn(dbCol, new_value);
    }
    render(){
        let { value, label, extraClass } = this.props;
        let lbl_cls = '', par_cls = 'c-input ipt ';
        if( value !== '' ) lbl_cls = 'w-val'; else lbl_cls = 'x-val'; 
        if( extraClass !== undefined ){
            par_cls += extraClass;
        }
        return(
            <div className = { par_cls }>
                <label className={lbl_cls}> { label }</label>
                <input 
                    value = { value }
                        onChange = { this.updateInput.bind(this) }/>
            </div>
        )
    }
}