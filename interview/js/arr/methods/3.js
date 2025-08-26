const people=[
    {name:'张三',age:18,role:'admin'},
    {name:'李四',age:19,role:'user'},
    {name:'王五',age:20,role:'user'},
    {name:'赵六',age:21,role:'admin'}
];
const addAdults=people.every(person=>person.age>=18);
console.log(addAdults);
const hasAdmin=people.some(person=>person.role==='admin');
console.log(hasAdmin);