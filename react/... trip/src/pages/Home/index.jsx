import useTitle from '@/hooks/useTitle'
import {
  Button
} from 'react-vant'
import {
 showToast
} from '@/components/Toast/toastController.js'

// import { showToast } from '../../components/Toast/toastController';

const Home = () => {
    useTitle('徐霞客游记');
  return (
    <div>
      <h1>Home</h1>
      <Button
       type="primary"
       onClick={()=>showToast(3,2,9)}
       >
        显示Toast
       </Button>
    </div>
  )
}
export default Home