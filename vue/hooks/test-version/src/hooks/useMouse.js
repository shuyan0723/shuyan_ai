import {
    ref,
    onMounted,
    onUnmounted // 计算属性
} from 'vue'


export function useMouse(){
    const x=ref(0);
    const y=ref(0);
    const updateMousePosition=(e)=>{
        x.value=e.clientX;
        y.value=e.clientY;
      }
   onMounted(()=>{
    console.log('组件挂载了');
    window.addEventListener('mousemove',updateMousePosition);

  })
  onUnmounted(()=>{
    console.log('组件卸载了');
    window.removeEventListener('mousemove',updateMousePosition);
    // 组件卸载时，移除事件监听
    // 避免内存泄漏
    // 事件监听函数中，使用了 this，所以需要绑定 this
    // 事件监听函数中，使用了 this，所以需要绑定 this
    // 事件监听函数中，使用了 this，所以需要绑定 this
  })

      return {
        x,
        y

      }

}