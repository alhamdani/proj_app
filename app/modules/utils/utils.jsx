export function sayHello(){
    alert('hello');
}
export function isAlreadyInUrl( arr, url ){
    for( let x = (arr.length - 1); x >=0 ; x-- ){
        if( arr[x] == url ){ // if equal not considering the type
            return true;
        }
        console.log(arr[x], url);
    }
    return false;
}