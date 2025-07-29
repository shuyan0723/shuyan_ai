import './App.css'
import HelloComponent from './components/HelloComponent.tsx'
// react + typescript
// javascript 可能会有些问题，主要因为弱类型
// jsx 后缀改成tsx 
// 函数进行类型约束
// const HelloComponent=()=>{
//    // void 空 ReactNode 
//    return 1
// }
function App() {
  // 编译阶段 
  // 多了类型申明文件
  // 多写一些代码 类型申明 代码质量保驾护航 
 let count:number=10;
  const title:string="hello typescript";
  const isDone:boolean=true;
  const list:number[]=[1,2,3];
  // 元组类型
  const tuple:[number,string]=[1,'2'];
  // 枚举类型
  enum Status{
     Pending,
     Fullfilled,
     Rejected
  }
  const pStatus:Status=Status.Pending;
  // 约束对象的类型
  // 接口类 不能用逗号，只能用分号
  interface User{
     name:string;
     age:number;
     isSingle?:boolean;
  }
  // 使用interface 来约定类型
  const user:User={
     name:'yan',
     age:18,
     isSingle:true
  }
  return (
    <>
     {count}
     {title}
     {user.name}{user.age}
     {/* typescript 很严格 */}
     <HelloComponent name="一明" age="123"/>
    </>
  )
}

export default App
