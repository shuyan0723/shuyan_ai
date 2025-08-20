import { 
    NextResponse 
} from 'next/server';

export async function GET(){
    try{
     const response=await fetch('http://api.github.com/users/shuyan0723/repos');
     const repos=await response.json();
    //  console.log(data);
     return NextResponse.json(repos);
    }catch(err){
        // console.log(err);
        return NextResponse.json({
           error:'获取失败'

        },{
            status:500
        })

    }

}
