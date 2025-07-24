import {useState} from 'react'


function Parent(){
    const [list,setList]=useState(['html','css','js'])
    return (
        <div>
            {/* 我是Parent */}
            <div className="hd">
                <input type="text" />
                {/* <button onClick={}>搜索</button> */}
                    </div>
                <div className="bd">
            <ul>
                {
                    list.map((item)=>{
                        return <li key={item}>{item}</li>
                    })
                }
            </ul>
               
            </div>
           
        </div>
    )
}
export default Parent