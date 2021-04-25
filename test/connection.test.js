const { EventEmitter } = require('events');
class MockSocket extends EventEmitter {
  setTimeout() {}
  setKeepAlive() {}
  connect() {}
  setEncoding() {}
  write() {}
}
jest.mock('net', () => {
  return {
    Socket: MockSocket,
  }
})

const Connection = require('../src/connection')

describe('connection', () => {
  
  test('data event', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(
`HTTP/1.1 200 OK\r\n
Transfer-Encoding: chunked\r\n
X-Dubbo-Attachments: dubbo=3.3.0\r\n
X-Routed-To: 10.215.30.57:7100\r\n
Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n
Content-Type: text/plain; charset=utf-8\r\n
Connection: keep-alive\r\n
Keep-Alive: timeout=5\r\n\r\n
{
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
  }\r\n\r\n`
      )
    })

    const dataList = [
`HTTP/1.1 200 OK\r\n
Transfer-Encoding: chunked\r\n
X-Dubbo-Attachments: dubbo=3.3.0\r\n
X-Routed-To: 10.215.30.57:7100\r\n
Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n
Content-Type: text/plain; charset=utf-8\r\n
Connection: keep-alive\r\n
Keep-Alive: timeout=5\r\n\r\n
13\r\n
{\n  "code": 0\r\n`,
`1a\r\n,\n    "msg": "ok",\n    "da\r\n`,
`13\r\nta": [{\n      "code\r\n`,
`2c\r\n": "+86",\n      "eng": "china",\n      "name"\r\n`,
`1c\r\n: "中国",\n      "zh": "zho\r\n`,
`10\r\nngguo"\n    }, {\n\r\n`,
`26\r\n      "code": "+54",\n      "eng": "Arg\r\n`,
`d\r\nentina",\n      "name": "阿根廷",\n      "zh\r\n`,
`18\r\n": "agenting"\n    }]\n  }\r\n0\r\n\r\n`,
]
    
    dataList.forEach(chunk => conn.socket.emit('data', chunk))
  })


  test('data event', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(
`HTTP/1.1 200 OK\r\n
Transfer-Encoding: chunked\r\n
X-Dubbo-Attachments: dubbo=3.3.0\r\n
X-Routed-To: 10.215.30.57:7100\r\n
Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n
Content-Type: text/plain; charset=utf-8\r\n
Connection: keep-alive\r\n
Keep-Alive: timeout=5\r\n\r\n
{
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
  }\r\n\r\n`
      )
    })

    const dataList = [
`HTTP/1.1 200 OK\r\n
Transfer-Encoding: chunked\r\n
X-Dubbo-Attachments: dubbo=3.3.0\r\n
X-Routed-To: 10.215.30.57:7100\r\n
Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n
Content-Type: text/plain; charset=utf-8\r\n
Connection: keep-alive\r\n
Keep-Alive: timeout=5\r\n\r\n
13\r\n
{\n  "code": 0\r\n1a\r\n,\n    "msg": "ok",\n    "da\r\n`,
`13\r\nta": [{\n      "code\r\n`,
`2c\r\n": "+86",\n      "eng": "china",\n      "name"\r\n`,
`1c\r\n: "中国",\n      "zh": "zho\r\n`,
`10\r\nngguo"\n    }, {\n\r\n`,
`26\r\n      "code": "+54",\n      "eng": "Arg\r\n`,
`d\r\nentina",\n      "name": "阿根廷",\n      "zh\r\n`,
`18\r\n": "agenting"\n    }]\n  }\r\n0\r\n\r\n`,
]
    
    dataList.forEach(chunk => conn.socket.emit('data', chunk))
  })
})
