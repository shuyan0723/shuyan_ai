# 秋招面试

## JS
- Object.assign() 
- 深浅拷贝
- = JS 内存相关 
- 拷贝(简单数据类型 复印了一份 ) 和引用式赋值 

- 响应式底层
    - Object.defineProperty()
    - Proxy 

- 属性描述符(property descriptor)
  configurable:false, //可配置  不能删除和修改
  enumerable:false, //不能枚举
  writable:false, //不能修改
  value:1,
  get:function(){
    console.log('读取了属性');
    return this.value;
  },
  set:function(newValue){
    console.log('设置了属性');
    this.value=newValue;
  }
