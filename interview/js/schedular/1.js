class TaskScheduler {
  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0; // 正在执行的任务数量
    this.taskQueue = []; // FIFO 
  }
  addTask(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.runningCount++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.runningCount--;
            this.schedule();
          })
      }
      this.taskQueue.push(run);
      this.schedule();
    })
  }
  schedule() {
    // 修复：将 this.queue 改为 this.taskQueue
    while(this.runningCount < this.maxConcurrency && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      task();
    }
  }
}

// 修复：将 resovle 改为 resolve
const tasks1 = () => new Promise(resolve => 
  setTimeout(() => {
    console.log('任务1完成');
    resolve(1);
  }, 1000)
)

const tasks2 = () => new Promise(resolve => 
  setTimeout(() => {
    console.log('任务2完成');
    resolve(2);
  }, 2000)
)

const tasks3 = () => new Promise(resolve => 
  setTimeout(() => {
    console.log('任务3完成');
    resolve(3);
  }, 1500)
)

const tasks4 = () => new Promise(resolve => 
  setTimeout(() => {
    console.log('任务4完成');
    resolve(4);
  }, 1000)
)

const scheduler = new TaskScheduler();
scheduler.addTask(tasks1);
scheduler.addTask(tasks2);
scheduler.addTask(tasks3);
scheduler.addTask(tasks4);