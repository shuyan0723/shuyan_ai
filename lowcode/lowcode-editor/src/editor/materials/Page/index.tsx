import type { CommonComponentProps } from '../../interface';
import { useDrop } from "react-dnd";
import {
  useComponentsStore  
} from '../../stores/components'
import {
  useComponentConfigStore
} from '../../stores/component-config';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

function Page({id, name, children}: CommonComponentProps) {
  const { addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const {canDrop,drop} = useMaterialDrop(['Button', 'Container'],id)
//   const [{ canDrop }, drop] = useDrop(() => ({
//     // 允许释放的元素
//     accept: ['Button', 'Container'],
//     drop: (item: {type: string},monitor) => {
//         const didDrop = monitor.didDrop();
//         if(didDrop){
//           return;
//         }
//       console.log(item, '/////');
//       const props = componentConfig[item.type].defaultProps;
//       addComponent({
//         id: new Date().getTime(),
//         name: item.type,
//         props
//       }, id)
//     },
//     collect: (monitor) =>({
//       canDrop: monitor.canDrop()
//     })
//   }))
  return (
    <div 
      ref={drop}
      className="p-[20px] h-[100vh] box-border">
      {children}
    </div>
  )
}
export default Page;