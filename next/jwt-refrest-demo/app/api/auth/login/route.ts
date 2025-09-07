import {
    NextRequest,
    NextResponse
} from 'next/server'
import {
    prisma
} from '@/lib/db'
import {
    emailRegex,
    passwordRegex
} from '@/lib/regexp'
import bcrypt from 'bcryptjs'
import {
    createTokens,

} from '@/lib/jwt'

export async function POST(request:NextRequest){
   try{
    const {
        email,
        password
    } =await request.json();
    
     if(!password||!emailRegex.test(email)){
        return NextResponse.json({
            error:'邮箱格式无效'
        },{
            status:400
        })
     }

       if(!password||!passwordRegex.test(password)){
        return NextResponse.json({
            error:'密码错误'
        },{
            status:400
        })
     }
    
        const user=await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return NextResponse.json({
                error:'用户不存在'
            },{
                status:401
            })
        }

   const isPassword=await bcrypt.compare(password,user.password);
          if(!isPassword){
            return NextResponse.json({
                error:'Invalid Credentials'
            },{
                status:401
            })
          }
       const {accessToken,refreshToken} = await createTokens(user.id);
   } catch(err){

   }
}