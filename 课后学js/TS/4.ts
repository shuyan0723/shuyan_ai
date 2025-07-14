// let x:any='hello'
// let y:number

// y=x
// let x:unknown
// x=1
// x='1'
// let z:string
// // z=x // 不能将类型“unknown”分配给类型“string”。

// let x:never
// x=1
// x=true

const x:boolean=true
const y:string='123'
const y2:String=new String(123)

const z:number=123
// const b:bigint=154664846n
const c:Symbol=Symbol('123')
const d:null=null

const e:object={foo:123}
const e2:object={foo:123}
const e3:Object=new String('123')
