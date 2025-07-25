import {
    useEffect,
    useState
} from 'react';
import {
    Button,
    Input,
    Loading
} from 'react-vant'

import useTitle from '@/hooks/useTitle'
import {
    kimiChat
} from '@/llm'
import styles from './trip.module.css';

const Trip = () => {
    useTitle('旅游智能客服')
    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleChat = () => {
      if(text.trim()==="") return;

        setIsSending(true)
    }
    return (
        <div className="flex flex-col h-all">
            <div className={`flex-1 ${styles.chatArea}`}>

            </div>
            <div className={`flex ${styles.inputArea}`}>
                <Input
                    value={text}
                    onChange={(e) => setText(e)}
                    placeholder="请输入消息"
                    className={`flex-1 ${styles.input}`}
                />
                <Button disabled={isSending} type="primary" onClick={handleChat} >发送</Button>
            </div>
            {isSending&& <div className='fixed-loading'><Loading type="ball"/></div>}
        </div>
    )
}

export default Trip