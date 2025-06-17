const addItems=document.querySelector('.add-items');// form
const itemsList=document.querySelector('.plates');// 列表

function addItem(e){
    e.preventDefault();// 阻止表单的默认提交行为
    
}
addItems.addEventListener('submit',addItem);// 监听form的submit事件