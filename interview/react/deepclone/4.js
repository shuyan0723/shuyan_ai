const target ={
    a:1,
}
const source ={
    // 对象嵌套 
    b: {
        name:'小明',
        hobbies: ['篮球','足球']
    },
    c:1
}
// 浅拷贝
// Object.assign(target,source)
// 常用的深拷贝
const newObj = JSON.parse(JSON.stringify(source))
console.log(newObj)
newObj.b.name = '小红'
newObj.c=2
console.log(newObj)
console.log(source)