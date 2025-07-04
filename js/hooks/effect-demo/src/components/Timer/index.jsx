import {
    useState,
    useEffect
} from 'react';
const Timer = () => {
    const [time,setTime]=useState(0);

    console.log('定时器开始运行');
    console.log('JSX编译');
    useEffect(()=>{
        console.log('定时器运行了');
        const interval=setInterval(()=>{
            setTime(prevTime=>prevTime+1);
        },1000)
    return ()=>{
            console.log('定时器被卸载了');
            clearInterval(interval);
        }
    },[]);
  return(
    <div>已经运行{time}秒</div>

  )
}

export default Timer;
