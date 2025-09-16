//编区域的数据由store 管理
import { create } from 'zustand'
// parentId + childern 可以构建出一个树元素

export interface Component {
    id: number;
    name: string;
    props: any;
    children?: Component[];
    parentId?: number;
}

interface State {
    components: Component[];
}
//store 主要提供State & Actions
interface Actions {
    addComponent: (component: Component, parentId?: number) => void;
    deleteComponent: (componentId: number) => void;
    updateComponentprops: (componentId: number, props: any) => void;
}
//交叉类型
export const useComponentsStore = create<State & Actions>(
    (
        (set, get) => ({
            components: [
                {
                    id: 0,
                    name: '???',
                    props: {},
                    children: [],
                }
            ],
            addComponent: (component, parentId) => set((state) => {
                if (parentId) {
                    const parentComponent = getComponentById(
                        parentId,
                        state.components
                    )
                    if (parentComponent) {
                        if (parentComponent.children) {
                            parentComponent.children.push(component)
                        } else {
                            parentComponent.children = [component]
                        }
                    }
                    component.parentId = parentId
                    return {
                        components: [...state.components]
                    }
                }
                return {
                    components: [...state.components, component]
                }
            }),
            deleteComponent: (componentId) => {
                if(!componentId) return
                const component = getComponentById(componentId,get().components)
                if(component?.parentId){
                    const parentComponent = getComponentById(
                        component.parentId,
                        get().components
                    )
                    if(parentComponent){
                        parentComponent.children = parentComponent?.children?.filter(
                            (child)=>child.id!==componentId
                        )
                        set({
                            components: [...get().components]
                        })
                    }
                }
             },
            updateComponentprops: () => { },
        })
    )
)

export function getComponentById(
    id: number | null,
    components: Component[]
): Component | null {
    if (!id) return null
    for (const component of components) {
        if (component.id === id) return component
        if (component.children && component.children.length > 0) {
            const result = getComponentById(id, component.children)
            if (result !== null) return result
        }
    }
    return null
}