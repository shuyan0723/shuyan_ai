function debounce(fn,delay){
   
    // 
  //   let id =null;
    return function(args){
      // 定时器返回id
      // fn 自由变量
      // fn 一等对象 
      var that=this;  // window
      console.log(that,'////');
      clearTimeout(fn.id)
      // if(fn.id){
      // clearTimeout(fn.id)
      // }
     fn.id= setTimeout(function(){
         // this丢失问题
        fn.call(that,args);
      },1000)
    }
  }
let obj={
    count:0,
    inc:debounce(function(val){
        // this
       console.log( this.count+=val);
       console.log(this.count,'/////');   
    },500)
}
obj.inc(2)