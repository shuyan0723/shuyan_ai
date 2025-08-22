const http = require('http');
const fs = require('fs');

http.createServer(function(request, response) {
    if (request.url === '/') {
        // index.html
        // async 异步 sync 同步
        // fs.readFile('test.html', 'utf-8', (err, data) => {

        // })
        // 性能差点
        const html = fs.readFileSync('test.html', 'utf-8');
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'Expires': new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString(),
            // 'Cache-Control': 'max-age=3600'

        });
        response.end(html)
    }
})
.listen(8888)