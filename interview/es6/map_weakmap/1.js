// node 运行 global 顶级对象
// global.gc(); // 手动触发垃圾回收
console.log(process.memoryUsage());

let map=new Map();
let key=new Array(1000000);

map.set(key,1)

console.log(process.memoryUsage());

key = null; // 手动触发垃圾回收
console.log(process.memoryUsage());
map=null;
// global.gc();
console.log(process.memoryUsage());
// map.delete(key); // 删除指定键的键值对
// console.log(process.memoryUsage());
// 内存使用情况统计
{/*
  rss: 27672576,        // 常驻集大小(Resident Set Size)：进程占用的物理内存(单位：字节)
  heapTotal: 5337088,   // V8引擎分配的总堆内存(单位：字节)
  heapUsed: 3874456,    // V8引擎当前实际使用的堆内存(单位：字节)
  external: 1262389,    // V8引擎管理的外部内存(单位：字节)
  arrayBuffers: 10515   // 与ArrayBuffer和SharedArrayBuffer相关的内存(单位：字节)
*/}