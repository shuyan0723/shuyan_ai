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

Object.assign(target,source)
target.b.name = '小红'
target.b.hobbies.push('羽毛球')
target.c = 2
console.log(source.b.name,source.b.hobbies,source.c)