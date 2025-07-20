import Child from '../Child';
import { useTheme } from '../../hooks/useTheme';

const Page =()=>{
    const theme=useTheme();
    return (
        <div className='{theme}'>
          {theme}
        <Child />
        </div>
    )
}

export default Page;