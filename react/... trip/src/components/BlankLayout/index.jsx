import {
    Outlet
} from 'react-router-dom'
const BlankLayout=()=>{
  return(
    <div>
        <Outlet />
      <h1>BlankLayout</h1>
    </div>
  )
}
export default BlankLayout
