// 进度条组件

const Progress=({text,percentage=0})=>{
    return (
        <div className="relative text-black bg-white rounded-lg text-left overflow-hidden">
           <div className="px-2 w-[1%] bg-blue-500 h-full whitespace-nowrap"
           style={{width:`${percentage}%`}}>
            {`${text}${percentage.toFixed(2)}%`}

            </div>

        </div>
    )
   
}
export default Progress

