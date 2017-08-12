import { observable, action } from 'mobx';

class HeaderStore{
    @observable header_menu = [
        { 'name' : 'Home', 'url' : 'home' },
        { 'name' : 'Party', 'url' : 'party' },
        { 'name' : 'Product', 'url' : 'product'}
    ];
}

let headerStore = new HeaderStore;

export default headerStore;