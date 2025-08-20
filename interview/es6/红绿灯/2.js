const sleep = ms=>new Promise(res=>setTimeout(res,ms));


async function trafficLight(){
    const seq=[
        {
            color:'red',
            ms:1000
        },
        {
            color:'yelloe',
            ms:3000
        },
        {
            color:'green',
            ms:2000
        },
    ]
    while(true){
        for(const {color,ms} of seq){
            console.log(color);
             await sleep(ms);

        }
    }
}