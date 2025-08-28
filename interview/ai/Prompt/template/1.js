class PromptTemplate {
    constructor(template) {
        this.template = template
    }
    format(variables){
        let result = this.template;
        for(const [key,value] of Object.entries(variables)){
            result=result.replace(new RegExp(`{${key}}`,'g'),value);
        }
        return result;
    } 
}
const tourismTemplate = new PromptTemplate(`
    你是一位专业的旅游顾问。
    你需要根据用户的需求，推荐合适的旅游目的地。
    请帮用户规划在{city}的{day}天旅游行程。
    要求：突出{preference}。
    `)
    const userInput={
        city:'西安',
        day:3,
        preference:'历史'
    }
    const finalPrompt=tourismTemplate.format(userInput);
    console.log(finalPrompt);
