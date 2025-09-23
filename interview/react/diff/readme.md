# diff算法
给两棵虚拟DOM树 Vnode Tree
要输出一个补丁(patches) 列表，描述如何把DOM 从oldTree 变成newTree
操作最少。

- 同层比较
- type不同，直接删除
- 递归的方式去比较children
- 根据 key 比较children 用移动代替修改，步骤越少越好

- props 比较
通过合并新旧属性键集并逐一对比，找出所有属性值的变化，统一打包为属性更新补丁，实现最小化更新。

