import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class Access{
    @observable _access = [];
    @observable treeAccess = [];
    @observable _modules = [];
    @observable isAccessLoaded = false;
    @observable _headers = [];
    @observable accessOnActive = [];

    @observable _vertical_nav_list = {};
    @observable _horizontal_nav_list = [];
    @observable _logged_module_ids = [];
    @observable _app_module_tree = {};
    @action defineUserAccess( path ){
        axios.get('getloggedinuseraccess/')
            .then((rs)=>{
                let { module_tree, login_module_id_acess } = rs.data;
                let _header = [];
                let _path = path.split('/');
                let headerUrl = _path[1]; // index zero == "" 
                for( let key in module_tree ){
                    let _q = module_tree[key];
                    if( headerUrl == _q.url ){
                        this._vertical_nav_list = _q;
                    }
                    _header.push({
                        'id' : _q.id,
                        'description' : _q.description,
                        'url' : _q.url 
                    });
                }
                console.log();
                console.log(' - - - - - - - - - User Logged in access - - - - - - - - - ');
                console.log( rs );
                console.log(' - - - - - - - - - End - - - - - - - - - ');
                // let temp_arr = [];
                // let data = rs.data.modules;

                

                // data.forEach((item)=>{
                //     if( item.url == headerUrl ){
                //         this.accessOnActive = item;
                //     }
                //     temp_arr.push({
                //         id : item.id,
                //         description: item.description,
                //         url : item.url
                //     })
                // })
                
                // this._modules = data;
                // this._headers = temp_arr;

                this._horizontal_nav_list = _header;
                this._logged_module_ids = login_module_id_acess;
                this.isAccessLoaded = true;
                this._app_module_tree = module_tree;
            });
    }
    @action updateVnavOnReload( parent_url ){
        console.log(parent_url);
    }
    @action updateSideNavList( super_parent_id ){
        let { _app_module_tree } = this;
        this._vertical_nav_list = _app_module_tree[ super_parent_id ];
    }
    @action setActiveModules( headerUrl ){
        let { _modules } = this;
        for( let x = 0; x < _modules.length; x++ ){
            if( _modules[x].url == headerUrl ){
                this.accessOnActive = _modules[x];
                break;
            }
        }
    }
    @action setFirstIdxToActive(){
        let { _modules } = this;
        this.accessOnActive = _modules[0];
    }

}

let access = new Access;
export default access;