
const target = {
    field1: 1,
    field2: undefined,
    field3: 'hxt',
    field4: {
        child: 'child',
        child2: {
            child2: 'child2'
        }
    },
    field5: [1,2,3,4,5]

}
target.target=target; // 循环引用
// es6 的新的数据类型hash Map 
function clone(target,map=new WeapMap()){
    if(typeof target==='object'){
      let cloneTarget=Array.isArray(target)?[]:{};
      if(map.get(target)){
        return map.get(target);
      }
       map.set(target,cloneTarget);

      for(const key in target){
        cloneTarget[key]=clone(target[key],map);

      }
     
      for(const key in target){
        cloneTarget[key]=clone(target[key]);
      }
       return cloneTarget;
    } else {
        return target;

    }
}
// 栈溢出
clone(target);
