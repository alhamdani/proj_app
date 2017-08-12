import { observable, action, computed } from 'mobx';


class LoginAccess{
    @observable _access = '';
    @action setLoginAccess(access){
        this._access = access;
    }
    @computed get access(){
        return this._access;
    }
}
let loginAccess = new LoginAccess;

export default loginAccess;