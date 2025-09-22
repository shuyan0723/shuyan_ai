let u:unknown;

u=123;
u='123';
if(typeof u==='number'){
    u.toFixed();// 安全
}
