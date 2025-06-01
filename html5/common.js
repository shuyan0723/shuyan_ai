const panels = document.querySelectorAll('.qq-panel');
panels.forEach(panel => {
    //JS 是事件机制的语言
    // 每一个元素上监听一个事件
    // 当这个元素触发这个事件的时候，执行对应的函数
  panel.addEventListener('click', () => {
    console.log('biubiu');
    removeActiveClasses();//模块化
    panel.classList.add("qq-panel-active");
})
})
function removeActiveClasses(){
  panels.forEach(panel => {
    panel.classList.remove("qq-panel-active");
  })
}
    
