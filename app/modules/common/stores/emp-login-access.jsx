import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class EmpLoginAccess{
    @observable _headers = [];
    @observable _navs = [];

    getAllAccess( emp_id ){
        axios.get('getuseraccess/', { params : { 'emp_id' : emp_id } })
            .then(function(rs){
                console.log(rs);
            });
    }

}

let empLoginAccess = new EmpLoginAccess;
export default empLoginAccess;