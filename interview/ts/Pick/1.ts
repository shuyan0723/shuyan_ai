type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  password: string; // 敏感信息
  createdAt: Date;
};

type SimpleUser = Pick<User, 'id' | 'name' | 'email'>;
const userUser:SimpleUser={
    id:123,
    name:'123',
    email:'123@qq.com',
}

type SafeUser=Omit<User,'password'>;
const safeUser:SafeUser={
    id:123,
    name:'123',
    email:'123@qq.com',
    age:18,
    createdAt:new Date(),
}