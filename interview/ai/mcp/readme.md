# mcp

- function call
  可以让大模型LLM 突破自身知识和能力的局限，通过调用外部工具
  或API来获取实时信息，执行计算或操作，从而获取最新数据
  精确计算与外部系统交互的复杂任务。
- mcp model context protocol
     是一个协议，是web 开发中的Restful 协议,如何讲外部资源暴露
     给LLM的协议和编程风格。
     是Function Call 的升级版

     在做各种Function Call有点乱的时候，mcp 统一了一切？

     mcp是LLM 与外界之间的通信协议，它就好像usb，LLM训练完后的不了解的知识。

     LLM 本身不知道怎么调用地图，数据库，搜索引擎，MCP规定了标准的上下文交换方式
     让模型能像调用api一样去访问外部能力。

    ## 举例
       高德地图MCP，请帮我规划从公司到机场的路线。
       模型根据高德地图MCP插件，获取实时路径和交通数据

    ## 意义
  - LLM 输出更可靠
  - 降低集成成本（自有系统和LLM集成）
  - 数据安全可控
 高德地图接入MCP，就像大模型LLM的眼睛和耳朵，让AI真正理解和使用实时世界

- 安装mcp 客户端
- 高德地图 apikey

## mcp 的使用
- mcp server 是基于mcp协议的服务器软件
   定义tool 定义.....
- LLM 
- mcp client cline/cursor 
    配置mcp server 
- LLM -> client -> server Transport 通信
