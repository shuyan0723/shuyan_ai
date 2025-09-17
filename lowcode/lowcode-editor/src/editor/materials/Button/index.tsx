import { Button as AntdButton } from 'antd';
// 修复类型导入路径 - Ant Design v5 使用新的类型导入方式
import type { ButtonProps as AntdButtonProps } from 'antd';

// 使用 Ant Design 的 ButtonProps 类型中的 type 属性类型
export interface ButtonProps {
  type: AntdButtonProps['type'];
  text: string;
}

const Button = ({ type, text }:ButtonProps) => {
  return (
    <AntdButton type={type}>{text}</AntdButton>
  )
}

export default Button;