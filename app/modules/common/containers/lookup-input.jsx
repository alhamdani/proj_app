import React from 'react';
import axios from "axios";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


export default class LookUpInput extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOptionsVisible : false,
            optionsList : [],
            inputValue : '',
            prevValue : ''
        }
    }
    componentDidMount(){
        // let { value } = this.props;
        // this.setState({inputValue : value});
    }
    focusHandler(){
        let { value } = this.props;
        this.setState({ isOptionsVisible : true, prevValue : value });
    }
    changeChangeHandler(ev){
        let { value, dbCol, colToUse  } = this.props;
        let new_value = ev.target.value;
        this.props.updaterFn(dbCol, new_value);
    }
    blurHandler(){
        this.setState({ isOptionsVisible : false });
    }
    selectOnList(item){
        let { dbCol, colToUse } = this.props;
        // let lbl = item.label.replace(/\s+/g,' ').trim();
        this.props.updaterFn(dbCol, item.label , { 'col' : colToUse, val : item.value } );
    }
    constructList(){
        let { optionsList } = this.state;
        return optionsList.map((item,idx)=>{
            return (
                <li key = { idx } onMouseDown = { this.selectOnList.bind(this, item) }>{ item.label }</li>
            )
        })
    }
    keyDownHandler(ev){
        if( ev.keyCode === 40 ){
            let new_value = ev.target.value;
            let { queryUrl } = this.props;
            axios.post( queryUrl, { 'searchKey' : new_value } )
                .then((rs)=>{
                    let data = rs.data.qs;
                    this.setState({ optionsList : data})
                })
        }else if( ev.keyCode === 27 ){
            let new_value = this.state.prevValue;
            let { dbCol } = this.props;
            this.setState({ isOptionsVisible : false });
            this.props.updaterFn(dbCol, new_value);
        }
    }

    render(){
        let { isOptionsVisible, inputValue } = this.state;
        let { label, value, extraClass } = this.props;
        let list = this.constructList();
        let cls = 'look-up-input ipt ';
        if( extraClass !== undefined ){
            cls += extraClass;
        }
        return(
            <div className = { cls }>
                <label>{ label }</label>
                <div className = 'look-up-body'>
                    <input 
                        value = { value }
                            onKeyDown = { this.keyDownHandler.bind(this) }
                                onChange = { this.changeChangeHandler.bind(this) }
                                    onFocus = { this.focusHandler.bind(this) } 
                                        onBlur = { this.blurHandler.bind(this) } type = 'text'/>
                    <ul className = 'look-up-options' style = { ({display : isOptionsVisible ? 'block' : 'none' }) }>
                        { list }
                    </ul>
                </div>
            </div>
        )
    }
}