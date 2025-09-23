function diff(oldNode, newNode, patches = []) {
  if (!newNode) {
    patches.push({type: "remove", oldNode})
  } else if (!oldNode || oldNode.type !== nodeNode.type) { // 新增， 类型不一祥
    patches.push({ type: 'REPLACE', oldNode, newNode})
  } else if (typeof oldNode === "string" && typeof newNode === "string") {
    // 文本节点
    if (oldNode !== newNode) {
      patches.push({ type: 'TEXT', oldText: oldNode, newText: newNode})
    }
  } else {
    // 
    const propPatches = []; // 自身的属性
    // 合并
    const allProps = { ...oldNode.props, ...newNode.props };
    for (const key in allProps) {
      if (oldNode.props[key] !== newNode.props[key]) {
        propPatches.push({
          key, 
          value:nodeNode.props[key]
        })
      }
    }
    if (propPatches.length) {
      patches.push({
        type: 'PROPS',
        node: oldNode,
        props: propPatches,
      })
    }

    const oldChildren = oldNode.children || [];
    const newChildren = newNode.children || [];
    const max = Math.max(oldChildren.length, newChildren.length);
    // hashMap 
    const oldKeyMap = {};
    oldChildren.forEach((child, i) => {
      if (child.props && child.props.key) {
        oldKeyMap[child.props.key] = i;
      }
    });
    for (let i = 0; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      let oldChild = oldChildren[i]; // 旧的子节点

      const key = newChild.props && newChild.props.key;
      if (key !== null && oldKeyMap[key] !== null) {
        oldChild = oldChildren[oldKeyMap[key]];
      }
      diff(oldChild, newChild, patches);
    }

    if (oldChildren.length > newChildren.length) {
      for (let i = newChild.length; i < oldChildren.length;i++) {
        patches.push({type: "REMOVE", oldTree: oldChildren[i]})
      }
    }
  }
  return patches;
}

console.log(diff(oldTree,newTree));
