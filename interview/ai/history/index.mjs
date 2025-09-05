import OpenAI from "openai";
import {
    config
} from 'dotenv'
config();
// console.log(process.env.OPENAI_API_KEY);
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
