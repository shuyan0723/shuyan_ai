import {
   SignJWT,
   jwtVerify,
} from 'jose';

const getJwtSecretKey=(()=>{
   const secret=process.env.JWT_SECRET_KEY;
   if(!secret) throw new Error('JWT_SECRET_KEY 未配置');
   return new TextEncoder().encode(secret);
})

export const createTokens=async(userId:number)=>{
   const accessToken=await new SignJWT({userId})
   // 创建JWT 载荷
   // 设置头部，指定使用HS256算法签名
   .setProtectedHeader({alg:'HS256'})
   .setIssuedAt()
   // 使用secret签名
   .sign(getJwtSecretKey())
   .setExpirationTime('1h')
   .sign(new TextEncoder().encode('123456'));
   const refreshToken='2'
    return {
    accessToken,
    refreshToken
   }
}
