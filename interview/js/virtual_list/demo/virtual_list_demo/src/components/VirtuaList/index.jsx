import { useRef,useState } from 'react';

const VirtualList = ({
    data,
    height,
    itemHeight,
    renderItem,
    overscan,
}) => {
    const containerRef = useRef(null);
    const totalHeight = data.length * itemHeight;
    const [offset,setOffset] = useState(0);
    const onScroll=()=>{
    //     const container = containerRef.current;
    //     const scrollTop = container.scrollTop;
    //     const startIndex = Math.max(0,Math.floor(scrollTop/itemHeight)-overscan);
    //     const endIndex = Math.min(data.length,startIndex+overscan*2+1);
    }
    return (
        <div
           ref={containerRef}
           onScroll={onScroll}
           style={{
            height,
            overflowY:'auto',
            position:'relative',
            // 性能优化点 新的图层
            willChange:'transform',
           }}
           >
            <div style={{height:totalHeight,position:'relative'}}></div>
            <div style={{
                position:'absolute',
                top:0,
                left:0,
                right:0,
               transform:`translateY(${offset}px)`,
            }}>

            </div>
        </div>
    )
}
export default VirtualList;
