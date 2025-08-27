interface Person{
    name:string;
    age:number;
}
//  继承
interface Employee extends Person{
    job:string
}

// 类型声明
type PersonType={
    name:string;
    age:number;
}
type EmployeeType=PersonType&{
    job:string;
}
