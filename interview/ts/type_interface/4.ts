type MyNumber = number; //基本类型
type ID = string | number; // 联合类型 ID 
type Point = [number, number] // 元祖
// 不支持
interface  ID2 = string | number;
// 不支持
interface  Point2 = [number, number];