const http = require('http');

const RESPONSE_TEXT =
  `{
  "code": 0,
  "msg": "ok",
  "data": [{
    "code": "+86",
    "eng": "china",
    "name": "中国",
    "zh": "zhongguo"
  }, {
    "code": "+54",
    "eng": "Argentina",
    "name": "阿根廷",
    "zh": "agenting"
  }]
}`

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function randomResponse(resp, text) {

  if (!text.length) {
    resp.end()
    return;
  }
  return sleep(10).then(() => {
    const chunkSize = Math.floor(Math.random() * 30) + 1;
    const chunk = text.substring(0, chunkSize);

    resp.write(chunk);

    randomResponse(resp, text.substring(chunkSize));
  });
}

function chunkHandle(req, resp) {
  resp.setHeader('Transfer-Encoding', 'chunked');
  resp.setHeader('X-Dubbo-Attachments', 'dubbo=3.3.0');
  resp.setHeader('X-Routed-To', '10.215.30.57:7100');
  resp.setHeader('Date', 'Mon, 08 Feb 2021 08:57:48 GMT');
  resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
  resp.statusCode = 200;

  randomResponse(resp, RESPONSE_TEXT);
}

const serverMap = new Map();
function startServer(port) {

  const server = http.createServer((req, resp) => {
    console.log(`${new Date()} ${req.method} => ${req.url}`);

    if (req.url === '/chunks') {
      return chunkHandle(req, resp)
    }

    // if (req.url === '/2-chunk') {

    // }

    if (req.url === '/index') {
      resp.end(RESPONSE_TEXT)
    }
  });

  serverMap.set(port, server);
  server.listen(port || 8484, () => {
    console.log('chunked mock service started! http://localhost:8484');
  });
}

function closeServer(port) {
  serverMap.get(port).close()
}

module.exports = {
  startServer,
  closeServer,
};