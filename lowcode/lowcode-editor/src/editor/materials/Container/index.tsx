// import type { PropsWithChildren } from "react";
import type { CommonComponentProps } from '../../interface';
import {
    useComponentsStore,
    // useComponentsStoreComponent
} from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import {
    useDrop
} from 'react-dnd';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

const Container=({children,id,name,props}:CommonComponentProps)=>{
    const {addComponent} = useComponentsStore();
    const {componentConfig} = useComponentConfigStore();
    const [{canDrop},drop] = useDrop(()=>({
        accept:['Button','Container'],
        drop:(item:{type:string})=>{
            addComponent({             
                id: new Date().getTime(),
                name:item.type,
                props
            },id)
        },
        collect:(monitor)=>({
            canDrop:monitor.canDrop(),
        })

    }))
  return (
    <div ref={drop} className="border-[1px] border-[#000] min-h-[100px] p-[20px]">
      {children}
    </div>
  )
}

export default Container