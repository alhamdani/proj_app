import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class FormView{
  @observable inputs = [];
  @observable isEditing = false;
}


let formView = new FormView;
export default formView;