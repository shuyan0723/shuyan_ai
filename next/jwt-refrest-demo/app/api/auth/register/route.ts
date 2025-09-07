import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    prisma
} from '@/lib/db'
import bcrypt from 'bcryptjs';
import {
  emailRegex,
  passwordRegex
} from '@/lib/regexp'
// resutdul 
// 匹配规则，符号数学
// . 什么都匹配，匹配一个
// + 一次或多次 
// @ email 必须要有的字符
// .+@ 在@前面至少要有一个字符
// \. 一定要有一个.    2737559680@qq.com


export async function POST(req:NextRequest){
    // 容错处理 稳定为主
  try{
        const {
            email,
            password
        } = await req.json();
         // 正则
        if  (!email || emailRegex.test(email)){
          return  NextResponse.json({error:'邮箱格式无效'},{status:400})
        }

       if(!password || passwordRegex.test(password)){
       return NextResponse.json(
            {error:'密码需要6-18位,且不能全为数字'},
            {status:400}
        )
       }

       // 检测用户名是否已经注册？
       const existingUser=await prisma.user.findUnique({
        where:{
          email
        }
       })
        if(existingUser){
          return NextResponse.json({
            error:'邮箱已注册'
          },{
            status:409
            })
        }
       
      // 密码的单向加密
      const hashedPassword=await bcrypt.hash(password,10)
      console.log(hashedPassword);
      await prisma.user.create({
        data:{
          email,
          password:hashedPassword
        }
      }) 
      return NextResponse.json({
        message:'Registration successful'
      },{
        status:201
      })
    } catch(err){
       console.log(err);
       return NextResponse.json({
        error:'Internal server error'
       },{
        status:500
       })
  }
}

