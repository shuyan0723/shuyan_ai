import { useEffect } from 'react'

function useTitle(title){
    useEffect(()=>{
        document.title=title || '默认标题'
    },[title])
}
 export default useTitle