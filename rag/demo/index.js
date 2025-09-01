const fs = require('fs'); // fs帮助我们读取文件
const path=require('path');
const {OpenAI} = require('openai');
require('dotenv').config();
// 模型 ollama 
// 给它喂私有的知识库，不怕私有被大模型训练了
// 安全
const openai=new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL:process.env.OPENAI_API_BASE_URL,
})

const testQuestion='有多少课程'

function readCourseInfo(){
    try{
        const filePath=path.join(__dirname,'lesson.txt');
        console.log(filePath);
        //  const courseInfo=fs.readFileSync(filePath,'utf-8');
        // return courseInfo;
        return fs.readFileSync(filePath,'utf-8');
        // 课程信息
    } catch(error){
        console.error('读取课程信息失败',error);
        return '';
    }
}

async function answerQuestion(question){
    // 检索
    const courseInfo = readCourseInfo();
    console.log(courseInfo);
    if(!courseInfo){
        // console.error('课程信息为空');
        return '课程信息为空',请确保lesson.txt文件存在;
    }
    try{
         const prompt = `
             你是一个课程助手，请根据以下课程信息回答问题。
             只回答与课程信息相关的内容，如果内容与课程无关，
             请礼貌地说明你只能回答与课程相关的问题。

             课程信息：
             ${courseInfo}
             问题：
             ${question}
         `

         const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ 
                role: 'system', 
                content: '你是一个专业的课程助手,你只能回答与课程相关的问题，不能回答与课程无关的问题。' 
          },
          {
            role: 'user',
            content: prompt
          }
          
        ],
        temperature:0.1,
        })
        return response.choices[0].message.content;
    } catch(err){
             console.log('回答问题失败',err);
             return '回答问题失败';
    }
}

answerQuestion(testQuestion)
  .then(answer=>{
     console.log('回答:',testQuestion);
     console.log('回答:',answer);
     return answer;
  })
