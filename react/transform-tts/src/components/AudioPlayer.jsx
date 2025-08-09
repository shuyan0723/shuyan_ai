import {
    useRef,
    useEffect
} from 'react'


const AudioPlayer=({audioUrl,mimeType})=>{
    const AudioPlayer=useRef(null)
    const audioSource=useRef(null)

    useEffect(()=>{
        if(audioSource.current&&audioSource.current){
            audioSource.current.src=audioUrl;
            AudioPlayer.current.play();
        }
    },[audioUrl])

    return (
       <div className='flex relative z-10 mt-4 w-full'>
        <audio 
        ref={AudioPlayer} 
        className='w-full h-14 rounded-lg
        bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10'

        src={audioUrl} 
        controls />
        <source ref={audioSource} type={mimeType} />
  
    
       </div>
    )
}
export default AudioPlayer
