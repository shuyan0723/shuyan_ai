# 响应式底层原理

- DOM Api -> 响应式业务
- Object.defineProperty(obj, 'value',{
    get,
    set
})
   对象上的某个属性的某些行为(get,set)进行定义,在完成本来的职责同时，去做dom 更新，
   这就是响应式
   拦截行为
- 缺点呢？有点麻烦，每次只能定义一个属性 
obj：要定义属性的对象。
- react,vue 现代前端mvvm 框架，早期用Object.defineProperty 
实现响应式,现在使用Proxy


'value'：要定义或修改的属性的名称。
get：当访问属性时调用的函数。
set：当设置属性时调用的函数。

descriptor：一个描述符对象，它定义了属性的配置。描述符可以是数据描述符或存取描述符。