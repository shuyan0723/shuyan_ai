// langchain loader 是RAG的基础功能 txt,pdf,excel,excel
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
//PuppeteerWebBaseLoader 是什么？
// 它是 LangChain Loader 家族中的一员，专门用于爬取网页内容的加载器。
const { createOpenAI } = require("@ai-sdk/openai");
// supabase 去做 向量化的知识库数据
console.log("开始向量化知识库数据");

const scrapePage = async (url: string): Promise<string> => {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: 'networkidle0',
      },
      evaluate: async(page, browser) => {
        const result = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return result;
      }
    });
  
    return await loader.scrape();
  }

const loadData = async (webpages: string[]) => {
    for (const url of webpages) {
        const content = await scrapePage(url);
    }
}
// 知识库的来源，可配置
loadData([
    "https://en.wikipedia.org/wiki/Samsung_Galaxy_S25",
    // "https://en.wikipedia.org/wiki/Samsung_Galaxy_S24",
    // "https://en.wikipedia.org/wiki/IPhone_16",
    // "https://en.wikipedia.org/wiki/IPhone_16_Pro",
    // "https://en.wikipedia.org/wiki/IPhone_15",
    // "https://en.wikipedia.org/wiki/IPhone_15_Pro",
  ]);