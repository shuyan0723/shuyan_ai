import { useParams } from 'react-router-dom'
import {
    useEffect
} from 'react'

const RepoDetail = ()=>{
    useEffect (()=>{

        const {id}=useParams();
        console.log();
        
    },[])
    return (
        <>
        <h1>RepoDetail</h1>
        </>
    )
}
export default RepoDetail