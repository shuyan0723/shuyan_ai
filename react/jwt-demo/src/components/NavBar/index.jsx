import {
    Link
} from 'react-router-dom'
import {
    useUserStore
} from '../../store/user'

const NavBar=()=>{
    const {isLogin,user,logout}=useUserStore();
    console.log(isLogin,user,'/////');
    
    return (
        <nav style={{padding:10,borderBottom:'1px solid #ccc'}}>
            <Link to="/">首页</Link>&nbsp;&nbsp;
            <Link to="/pay">支付</Link>&nbsp;&nbsp;
            {
                isLogin ? (
                    <>
                        <span>欢迎您，{user.username}</span>   {/* &nbsp;&nbsp; */}
                        <button onClick={logout}>退出</button>
                    </>
                ):(
                   <Link to="/login">登录</Link>
                )
            }
            {isLogin && <button onClick={logout}>退出</button>}
            {!isLogin && <Link to="/login">登录</Link>}
        </nav>
    )
}
export default NavBar;