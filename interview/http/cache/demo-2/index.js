// 协商缓存，在返回文件的同时，响应头
const fs = require('fs');
const http = require('http');
const path = require('path');
const crypto = require('crypto'); // 加密 hash计算
// 单向加密 生成hash 
function md5(){
    return crypto.createHash('md5').update('123456').digest('hex');
    // 123456 加密后的结果
    // 789012 加密后的结果
}
http.createServer(function(request, response) {
    if(request.url === '/'){
        const html = fs.readFileSync('test.html', 'utf-8');
        response.writeHead(200, {
            'Content-Type': 'text/html',
            // 'ETag': md5(),
            // 'Expires': new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString(),
            // 'Cache-Control': 'max-age=3600'
        });
        response.end(html)
    }
    if(request.url === '/script.js'){
        // 浏览器缓存文件的 hash 
        const noneMatch = request.headers['if-none-match'];
        const filePath = path.join(__dirname, 'request.url');
        const buffer = fs.readFileSync(filePath);
        const fileMd5 = md5(buffer);

        if(noneMatch === fileMd5){
            response.statusCode = 304;  //304 Not Modified 
            response.end();
            return;
        }
        response.writeHead(200, {
            'Content-Type': 'text/javascript',
            'ETag': fileMd5,
            'Cache-Control': 'max-age=0'
        });
        // response.end()
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);

    }

})

.listen(1234)
