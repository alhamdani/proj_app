import { action, computed, observable } from 'mobx';
import axios from 'axios';
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class NavMenuStore{
  @observable side_menus = [
    { 
      'id' : 1, 'name' : 'menu one', 'parent' : 0, 
      'child' : [
        { 'name' : 'another menu', id : 22 }
      ] 
    },
    { 'id' : 2, 'name' : 'menu two', 'parent' : 0 },
    { 'id' : 3, 'name' : 'menu three', 'parent' : 0 },
    { 'id' : 4, 'name' : 'sub-nav one', 'parent' : 1 },
    { 'id' : 5, 'name' : 'sub-nav two', 'parent' : 1 },
    { 'id' : 6, 'name' : 'sub-nav three', 'parent' : 3 },
  ];
  
  @observable top_menus = [
    { 'id' : 9, 'name' : 'Main one', 'parent' : 0},
    { 'id' : 10, 'name' : 'Main two', 'parent' : 0 },
    { 'id' : 11, 'name' : 'Main Three', 'parent' : 0 }
  ];
  
  
 
}

let navMenuStore = new NavMenuStore;

export default navMenuStore;