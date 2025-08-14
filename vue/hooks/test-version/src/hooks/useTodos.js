import {
  ref,
  computed //计算属性

} from 'vue'

export function useTodos(){
   let title=ref("");
   let todos=ref([
    {   
        id:1,
        title:"学习vue",
        done:false
    },
    {
        id:2,
        title:"学习react",
        done:false
    },
    {
        id:3,
        title:"学习angular",
        done:false
    },
    {
        id:4,
        title:"学习node",
        done:false

    }
   ])
   function addTodo(){
    todos.value.push({
        title:title.value,
        done:false
    })
      title.value="";
   }
   function clear(){
    // done false 留下，已完成的清除
    todos.value=todos.value.filter((v)=>!v.done);
   }
   // 计算属性，返回未完成的任务 未完成的todos 的数量
   let active=computed(()=>{
       return todos.value.filter((v)=>!v.done).length; //用来过滤未完成false
   })
   let all =  computed(()=> todos.value.length);
   let allDone = computed({
    get: function(){
      return active.value === 0;
    },
    set: function(value){
      todos.value.forEach((v)=>{
        v.done = value; // 修复这里，移除 v.todo
      });
    }
   });
   return {
     title,
     todos,
     addTodo,
     clear,
     active,
     all,
     allDone
   };
}