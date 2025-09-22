import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
    // 使用 useRef<T | undefined>(undefined) 确保类型安全
    const ref = useRef<T | undefined>(undefined);
    
    // 保存当前值用于返回
    const previousValue = ref.current;
    
    // 在组件渲染完成后更新 ref 的值
    useEffect(() => {
        ref.current = value;
    }, [value]);
    
    // 返回上一次的值
    return previousValue;
}