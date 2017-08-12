import { observable, action, computed } from 'mobx';


class ActionMenuStore {
  @observable visible = false;
  @observable pos_x = 0;
  @observable pos_y = 0;
  @observable width = 150;
  @observable option_list = [];
  @action updateOptionList( opts ){
    // this.option_list = opts;
    if( opts.length ){
      this.option_list = opts.map((item)=>(item));
    }else{
      console.log('result: option list failed to update!');
    }
  }
  @computed get getOptionLists(){
    return this.option_list;
  }
  @computed get getVisible(){
    return this.visible;
  }
  @computed get getWidth(){
    return this.width;
  }
  @computed get getX(){
    return this.pos_x;
  }
  @computed get getY(){
    return this.pos_y;
  }
  @action showContextMenu(){
    this.visible = true;
  }
  @action hideContextMenu(){
    this.visible = false;
  }
  @action toggleContextMenu(){
    this.visible = !this.visible;
    // console.log(this.visible);
  }

  @action updateCoordinate( pos_x, pos_y ){
    this.pos_x = pos_x;
    this.pos_y = pos_y;
  }

  
}

let actionMenuStore = new ActionMenuStore;

export default actionMenuStore;