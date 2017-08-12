import { observable, action, computed } from 'mobx';


class AppTab{
    @observable tabs = [];
    @observable selectedTabIdx = 0;
    @action addTab(cmpnt){
        let { tabs } = this;
        if( tabs.length ){
            cmpnt.isVisible = false;
        }else{
            cmpnt.isVisible = true;
        }
        this.tabs.push(cmpnt);
    }
    @action setActiveTab(idx){
        let { tabs } = this;
        let _idx = 0;
        if( idx !== undefined ){
            _idx = idx;
        }
        tabs.forEach((item, __idx)=>{
            if( __idx == _idx ){
                item.isVisible = true;
            }else{
                item.isVisible = false;
            }
        })
        this.selectedTabIdx = _idx;
        this.tabs = tabs;
    }
}

let appTab = new AppTab;
export default appTab;