import {
    memo,
    useEffect,
    useRef,
    useState,
    useMemo
} from 'react'
import {
    ArrowLeft,
    Close
} from '@react-vant/icons'
import styles from './search.module.css'
import { debounce } from '../../utils';
const SearchBox=(props)=>{
    //   /api
    // 单项数据流
    // 子父通信
    const [query,setQuery]=useState('');

    const {handleQuery}=props
    const handleChange=(e)=>{
         let val=e.currentTarget.value
         setQuery(val);
    }
     const clearQuery=()=>{
        setQuery('');
        queryRef.current.value="";
        queryRef.current.focus();
    }
    const queryRef=useRef(null);
    const displayStyle=query?{display:'block'}:{display:'none'};
    // 1.防抖
    // const handleQueryDe=debounce(handleQuery,500)
    // 2.useMemo 缓存debounce结果 否则会反复执行
    const handleQueryDebounce=useMemo(()=>{
        return debounce(handleQuery,300)
    },[])
    useEffect(()=>{
        console.log(query,'/////////');
        
        handleQueryDebounce(query);
    },[query])
   
    // 搜索框的ref
    return (
        <div className={styles.wrapper}>
         <ArrowLeft onClick={()=>history.go(-1)} />
            <input
               type='text'
               className={styles.ipt}
               placeholder='搜索旅游相关'
                ref={queryRef}
                onChange={
                    handleChange
                }
               />
               {/* 移动端用户体验 */}
                <Close onClick={clearQuery} style={displayStyle}/>
        </div>
    )
}
export default memo(SearchBox)