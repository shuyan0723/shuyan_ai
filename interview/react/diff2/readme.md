# diff

React diff 算法核心用最小的计算成本找到两棵树的差异，然后只更新真正变化的节点，
及收集到patches.
真是的DOM 树可能比较深，如果每次都做完整的树比对，时间复杂度O(n^3) ,页面会卡。
diff 算法基于两个前提来优化的：
- 同级比较， 如果一个结点类型不一样，直接替换，不做子树的比较
- 列表用key，快速找到元素的前后对应关系，移动或复用结点，而不是暴力删除重建。

O(n^3) -> O(n)
diff 算法的核心思想是 分层比较 + key 定位 + 最小化更新
简单diff
   一个个节点来比对， 去旧列表找key 一样的。找到了就看是不是在后面，不动，不是就移动到新位置，
   lastIndex 记录当前比对到的旧列表的位置， 每次比对完一个节点，lastIndex 就+1
   如果比对到最后一个节点， 还没有找到， 就删除旧列表的节点
   A B C 0 - 1 - 2 旧的节点 他要移动1
   B C A 新的节点  标准
   lastIndex 0
   i = 0 新 B 旧 B j=1 > lastIndex 不移动 lastIndex = 1
   i = 1 新 C 旧 C j=2 > lastIndex 不移动 lastIndex = 2
   i = 2 新 A 旧 A j=0 > lastIndex 移动到0  lastIndex = 0
   简单diff 算法 挺好
   lastIndex=0
   DABC 新
   i = 0 D j=3>lastIndex 不用移动 lastIndex = 3
   i=1   A j=0<lastIndex 移动到  lastIndex =1
   i=2   B j=1==lastIndex 移动到  lastIndex =1
   i=3   C j=2<lastIndex 移动到  lastIndex =3

   
双端diff