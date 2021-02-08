const http = require('http');

const text = `
Shall I compare thee to a summer's day?

Thou art more lovely and more temperate:

Rough winds do shake the darling buds of May,

And summer's lease hath all too short a date:

Sometime too hot the eye of heaven shines,

And often is his gold complexion dimm'd;

And every fair from fair sometime declines,

By chance,or nature's changing course untrimm'd;

But thy eternal summer shall not fade,

Nor lose possession of that fair thou ow'st;

Nor shall Death brag thou wander'st in his shade,

When in eternal lines to time thou grow'st:

So long as men can breathe,or eyes can see,

So long lives this and this gives life to thee`

function randomResponse(resp, text) {
  
  while(text.length) {
    const chunkSize = Math.floor(Math.random() * 20) + 1;
    const chunk = text.substring(0, chunkSize);
  
    resp.write(chunk);

    text = text.substring(chunkSize);
  }
  console.log('ending response');
  resp.end();
}

const server = http.createServer((req, resp) => {
  console.log(`${req.method} => ${req.url}`);

  resp.setHeader('Transfer-Encoding', 'chunked');
  resp.setHeader('X-Dubbo-Attachments', 'dubbo=3.3.0');
  resp.setHeader('X-Routed-To', '10.215.30.57:7100');
  resp.setHeader('Date', 'Mon, 08 Feb 2021 08:57:48 GMT');
  resp.setHeader('Content-Type', 'text/plain; charset=utf-8');
  resp.statusCode = 200;

  randomResponse(resp, text);
});

server.listen(8484, () => {
  console.log('chunked mock service started! http://localhost:8484');
});