import { observable, action, computed } from 'mobx';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";


class AppTable {
    @observable _rows = [];
    @observable _cols = [];
    
    @observable _isVisible = true;

    @observable _isLoaded = false;

    @observable _current_page = 1;
    @observable _counted_list = 0;
    @observable _max_page = 0;
    @observable _limit = 10;
    @observable _urls = {};

    @observable _searchKey = '';
    @observable _searchCount = 0;

    @observable _selectedCount = 0;
    @observable _isAllSelected = false;

    @action setUpColumns( cols ){
        if( cols.length ){
            this._cols = cols;
        }
    }
    @action setUpUrls(urls){
        if( Object.keys(urls).length ){
            this._urls = urls;
        }
    }
    @action queryOnRange( search ){
        let { listQuery } = this._urls;
        let { _limit, _current_page, _cols, _searchKey } = this;
        let _to = _limit * _current_page;
        let _from = _to - _limit;
        this._isLoaded = false;

        axios.post( listQuery, { 
                'columns' : _cols, 
                    'searchKey' : _searchKey, 
                        '_from' : _from, '_to' : _to } )
                .then(function(rs){
                    let data = rs.data.qs;
                    data.forEach((el)=>{el.isSelected = false;})
                    this._rows = data;
                    this._isLoaded = true;
                }.bind(this))
       
        // let { _limit } = this
    }
    @action changeLimit( lmt ){
        let { _counted_list } = this;
        this._limit = lmt;
        this._current_page = 1;
        this._max_page = Math.ceil( _counted_list/lmt );
        this.queryOnRange();
    }
    @action queryCount(){
        let { countQuery } = this._urls;
        let { _limit } = this;
        axios.get( countQuery ).then(function(rs){
            let data = rs.data;
            let { counted } = data;
            this._counted_list = counted;
            this._max_page = Math.ceil(counted/_limit);
        }.bind(this))
    }
    @action querySearch( key ){
        let { searchCountUrl } = this._urls;
        let { _cols, _limit } = this;
        
        axios.post(searchCountUrl, { 'columns' : _cols, 'searchKey' : key })
            .then((rs)=>{
                let {counted} = rs.data;
                this._current_page = 1;
                this._max_page = Math.ceil( counted/_limit );
                this._searchKey = key;
                this.queryOnRange();
            })
    }
    @action nextPage(){
        let { _current_page, _max_page } = this;
        if( _current_page < _max_page ){
            this._current_page = _current_page + 1;
            this.queryOnRange();
        }
    }
    @action prevPage(){
        let { _current_page } = this;
        if( _current_page > 1 ){
            this._current_page = _current_page - 1;
            this.queryOnRange();
        }
    }
    @action gotoPage(page){
        let { _max_page } = this;
        if( page > 0 && page <= _max_page ){
            this._current_page = page;
            this.queryOnRange();
        }

    }

    @action updateCols(){
        let temp_arr = [
            { 'id' : '1', 'f_name' : 'Nylah', 'l_name' : 'Holmes' },
            { 'id' : '1', 'f_name' : 'Luca', 'l_name' : 'Gates' },
            { 'id' : '1', 'f_name' : 'Gillian', 'l_name' : 'Ware' },
            { 'id' : '1', 'f_name' : 'Braelyn', 'l_name' : 'Pham' },
            { 'id' : '1', 'f_name' : 'Atticus', 'l_name' : 'Curry' },
            { 'id' : '1', 'f_name' : 'Laney', 'l_name' : 'Fuller' },
            { 'id' : '1', 'f_name' : 'Desmond', 'l_name' : 'Walter' },
            { 'id' : '1', 'f_name' : 'Carolina', 'l_name' : 'Scott' },
            { 'id' : '1', 'f_name' : 'Lyla', 'l_name' : 'Vaughan' },
            { 'id' : '1', 'f_name' : 'Chris', 'l_name' : 'Alvarez' },

            { 'id' : '1', 'f_name' : 'Destinee', 'l_name' : 'Armstrong' },
            { 'id' : '1', 'f_name' : 'Ansley', 'l_name' : 'Armstrong' },
            { 'id' : '1', 'f_name' : 'Thaddeus', 'l_name' : 'Sawyer' },
            { 'id' : '1', 'f_name' : 'Jaylin', 'l_name' : 'Kelly' },
            { 'id' : '1', 'f_name' : 'Aisha', 'l_name' : 'Walsh' },
            { 'id' : '1', 'f_name' : 'Kylie', 'l_name' : 'Padilla' },
            { 'id' : '1', 'f_name' : 'Jayleen', 'l_name' : 'Ayala' },
            { 'id' : '1', 'f_name' : 'Evelin', 'l_name' : 'Monroe' },
            { 'id' : '1', 'f_name' : 'Cael', 'l_name' : 'Warner' },
            { 'id' : '1', 'f_name' : 'Kyler', 'l_name' : 'Chambers' } 
        ]
        this._rows = temp_arr;
    }
    @action updateRows(){
        let temp_arr = ['f_name', 'l_name'];
        this._cols = temp_arr;
    }
}

let appTable = new AppTable;
export default appTable;