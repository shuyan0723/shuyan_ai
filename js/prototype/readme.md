# 原型
- oop 机制 object oriented Programming 面向对象
- 封装，**继承**，多态，接口

## JS oop
- 独享字面量 一堆一样的对象创建麻烦
- 类的概念，没有class 关键字
- 构造函数不能省的
- 赋予函数新的使命，身兼两职，构造函数，普通函数
    类 + 构造函数 

    ## JS 面向对象更强大，它是原型式的
    - 任何对象 默认指向object  
    - __proto__
      任何对象都有这个私有属性，对象和构造函数和类之间没什么血缘关系(daiyun)
      -JS 本没有类
       只不过用function 大写 来表示类，
       - JS 对象和类，构造函数 没有血缘关系 
       __proto__ 指向构造函数的prototype 属性
    -  __proto__ 指向任何对象
    _  不指默认是object
    -  原型对象，原型链
    -  类是大写的函数
    -  实例 new 出来的对象
    -  任何函数都有一个prototype 属性，值都是构造函数的原型对象
      ## new 的过程
      new -> {} -> constructor 运行 -> this ->{}->完成了构造
      -> __proto__ -> constructor.prototype -> object 原型链
      -> null 终点