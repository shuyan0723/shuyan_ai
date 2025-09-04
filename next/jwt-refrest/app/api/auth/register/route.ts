import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    prisma
} from '@/lib/db'
// resutdul 
// 匹配规则，符号数学
// . 什么都匹配，匹配一个
// + 一次或多次 
// @ email 必须要有的字符
// .+@ 在@前面至少要有一个字符
// \. 一定要有一个.    2737559680@qq.com
const emailRegex=/.+@.+\..+/;//RegExp

export async function POST(req:NextRequest){
    // 容错处理 稳定为主
  try{
        const {
            email,
            password
        } = await req.json();
         // 正则
        if  (!email || !password) {
            return NextResponse.json({
                error:`Email or password is empty`
            },{
                status:400
            })
  } catch(err){

  }
}

