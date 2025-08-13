const target ={
    a:1,
    b:2
}
const source ={
    b:3,
    d:4
}
// 后来者居上 
Object.assign(target,source)
console.log(target)