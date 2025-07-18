import { 
    useParams ,
    useNavigate,
     Link
} from 'react-router-dom'
import {
    useEffect
} from 'react'
import {
    useRepos
   
} from '@/hooks/useRepos';
const RepoList = ()=>{
        const {id}=useParams();
        console.log(useParams());
        const navigate = useNavigate();
        const {repos,loading,error} = useRepos(id);
        // hooks 
        // const {}
        useEffect(()=>{
            if(!id.trim()){
                return navigate('/');
            }

            
        },[])
        if(loading) return (<>Loading...</>)
        if(error) return (<>Error:{error}</>)

    return (
        <>
        <h1>Repositories for {id}</h1>
        {
            repos.map((repo)=>(
                <div>
                <Link key={repo.id} to={`/users/${id}/repos/${repo.name}`}>
              
                    <h2>{repo.name}</h2>
                
                </Link>
                </div>
            ))
        }
        </>
    )
}
export default RepoList