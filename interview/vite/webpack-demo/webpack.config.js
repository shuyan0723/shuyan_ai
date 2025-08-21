const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


// webpack 配置文件
module.exports={
    entry:'./src/main.jsx', // 申明入口，webpack整理依赖关系，并打包
    output:{
        // path:__dirname+'/dist', // 输出路径
        filename:'bundle.js', // 输出文件名
        path:path.resolve(__dirname,'dist'),
        clean:true // 每次打包前，先清空dist目录

    },
    mode:'development', // 开发模式
      target:'web',
      module:{ // webpack 支持解析的模块文件
        rules:[
            {
                test:/\.css$/i, // css文件在这里处理
                use:['style-loader','css-loader'] // 从右向左解析，先解析css-loader，再解析style-loader

            },
            {
                
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-react']
    }
  }
}
            
        ]
      },
      plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'./public/index.html'), // 模板文件
            filename:'index.html',       // 输出文件名
            inject:'body'               // 脚本插入位置
        })
      ],
      devServer:{
        port:8082,
        open:true,
        hot:true,
        static:{
            directory:path.resolve(__dirname,'dist'),
        }

      }
}