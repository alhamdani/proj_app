import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class AppForm{
    @observable _inputs = {};
    @observable isVisible = false;
    @observable isEditing = false;
    @observable isInputSetUp = false;
    @observable headerTitle = '';
    
    @action setHeaderTitle(_str){
        this.headerTitle = _str;
    }
    @action setUpInputs( inputs ){
        let _w = {};
        inputs.forEach((item) => {
            _w[item.dbCol] = item;
            if( item.type == 'lookup' ){
                let url = item.getInfoUrl;
                _w[item.dbCol][item['colToUse']] = '';
            }
        })
        this._inputs = _w;
        this.isInputSetUp = true;
    }
    @action updateInput( col, val, pkObj ){
        let { _inputs } = this;
        if( pkObj !== undefined ){
            _inputs[ col ][ pkObj['col'] ] = pkObj['val'];
        }
        _inputs[ col ].value = val;
        this._inputs = _inputs;
    }
    @action updateAllInput( obj ){
        let { _inputs } = this;
        console.log(obj)
        for( let key in _inputs ){
            if( obj[key] !== undefined ){
                if( _inputs[key].type == 'lookup' ){
                    let {dbCol} = _inputs[key];
                    axios.get(  _inputs[key].getInfoUrl, { params : { 'id' : obj[ dbCol ] }} )
                        .then((rs)=>{
                            let data = rs.data.qs;
                            this._inputs[key].value = data.label;
                        })
                }else{
                    _inputs[key].value = obj[key];
                }
            }else{
                console.log(obj[key], key)
                
            }
        }
        // this._inputs = _inputs;
    }
    @action clearInputValues(){
        let { _inputs } = this;
        for( let key in _inputs ){
            _inputs[key].value = '';
        }
        this._inputs = _inputs;
    }
    @action saveNewData(){
        // console.log(this._inputs);
    }
}
let appForm = new AppForm;
export default appForm;