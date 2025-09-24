const tasks1 = () => new Promise(resovle => 
  setTimeout(() => {
    console.log('任务1完成');
    resolve(1);
  }, 1000)
)

const tasks2 = () => new Promise(resovle => 
  setTimeout(() => {
    console.log('任务2完成');
    resolve(2);
  }, 2000)
)

const tasks3 = () => new Promise(resovle => 
  setTimeout(() => {
    console.log('任务3完成');
    resolve(3);
  }, 1500)
)

const tasks4 = () => new Promise(resovle => 
  setTimeout(() => {
    console.log('任务4完成');
    resolve(4);
  }, 1000)
)