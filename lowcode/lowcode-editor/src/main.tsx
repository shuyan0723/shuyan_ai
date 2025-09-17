import ReactDom from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

ReactDom.createRoot(
  document.getElementById('root')!//非空断言
).render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
)