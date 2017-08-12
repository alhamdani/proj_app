import { action, computed, observable } from 'mobx';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class VerticalNavStore {
    @observable 
}