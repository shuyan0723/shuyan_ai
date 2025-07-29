import React from 'react'
// 如何约束函数的返回值为ReactNode? JSX
// FC==FunctionComponent
//  FunctionComponent 是 React 中用于定义函数式组件的类型接口，指定组件的 props 类型和返回值类型。
// 如何约定自己需要一个name 的 prop?
interface Props {
    name:string;
}  
// typescript 类型约束， 重要的地方一定要约束
// 参数，返回值
// 泛型 泛指内部的类型
const HelloComponent: React.FC<Props>= (props) => {
    // const {name} = props
     return(
        <h2>Hello user:{props.name}</h2>
     )
}
export default HelloComponent
