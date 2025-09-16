// 修复 Allotment 导入方式
import { Allotment } from 'allotment';
// 样式导入保持不变
import 'allotment/dist/style.css';
// 修复组件导入方式，使用默认导入
import Header from './components/Header/index';
import {Material} from './components/Material/index';
import {Setting} from './components/Setting/index';
import {EditArea} from './components/EditArea/index'; // 修正名称为EditArea

export default function LowcodeEditor() {
    return (
        <div className='h-[100vh] flex flex-col'>
            <Header />
            <div className='flex-1'>
                <Allotment>
                    <Allotment.Pane preferredSize={240} minSize={100} maxSize={400}>
                        <Material />
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={300} minSize={200} maxSize={600}>
                        <EditArea />
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={300} minSize={200} maxSize={400}>
                        <Setting />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    )
}