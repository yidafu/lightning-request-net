const {
  EventEmitter
} = require('events');
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

const RESPONSE_TEXT = `HTTP/1.1 200 OK\r\n` +
  `Transfer-Encoding: chunked\r\n` +
  `X-Dubbo-Attachments: dubbo=3.3.0\r\n` +
  `X-Routed-To: 10.215.30.57:7100\r\n` +
  `Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n` +
  `Content-Type: text/plain; charset=utf-8\r\n` +
  `Connection: keep-alive\r\n` +
  `Keep-Alive: timeout=5\r\n\r\n` +
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
  }`;
describe('connection', () => {

  test('data event 1', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(
        RESPONSE_TEXT
      )
    })

    const dataList = [
      `HTTP/1.1 200 OK\r\n` +
      `Transfer-Encoding: chunked\r\n` +
      `X-Dubbo-Attachments: dubbo=3.3.0\r\n` +
      `X-Routed-To: 10.215.30.57:7100\r\n` +
      `Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n` +
      `Content-Type: text/plain; charset=utf-8\r\n` +
      `Connection: keep-alive\r\n` +
      `Keep-Alive: timeout=5\r\n\r\n` +
      `13\r\n` +
      `{\n    "code": 0\r\n`,
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


  test('data event 2', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(RESPONSE_TEXT)
    })

    const dataList = [
      [`HTTP/1.1 200 OK\r\n`,
        `Transfer-Encoding: chunked\r\n`,
        `X-Dubbo-Attachments: dubbo=3.3.0\r\n`,
        `X-Routed-To: 10.215.30.57:7100\r\n`,
        `Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n`,
        `Content-Type: text/plain; charset=utf-8\r\n`,
        `Connection: keep-alive\r\n`,
        `Keep-Alive: timeout=5\r\n\r\n`,
        `13\r\n`,
        `{\n    "code": 0\r\n1a\r\n,\n    "msg": "ok",\n    "da\r\n`
      ].join(''),
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

  test('data event 3', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(RESPONSE_TEXT)
    })

    const dataList = [
      [`HTTP/1.1 200 OK\r\n`,
        `Transfer-Encoding: chunked\r\n`,
        `X-Dubbo-Attachments: dubbo=3.3.0\r\n`,
        `X-Routed-To: 10.215.30.57:7100\r\n`,
        `Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n`,
        `Content-Type: text/plain; charset=utf-8\r\n`,
        `Connection: keep-alive\r\n`,
        `Keep-Alive: timeout=5\r\n\r\n`,
        `e\r\n`,
        `{\n    "code": \r\n`
      ].join(''),
      `19\r\n0,\n    "msg": "ok",\n    "\r\n`,
      `1e\r\ndata": [{\n      "code": "+86",\r\n`,
      `1e\r\n\n      "eng": "china",\n      "\r\n`,
      `1a\r\nname": "中国",\n      "zh\r\n`,
      `1a\r\n": "zhongguo"\n    }, {\n   \r\n`,
      `b\r\n   "code": \r\n`,
      `17\r\n"+54",\n      "eng": "Ar\r\n`,
      `18\r\ngentina",\n      "name": \r\n`,
      `15\r\n"阿根廷",\n      "z\r\n`,
      `18\r\nh": "agenting"\n    }]\n  \r\n`,
      `1\r\n}\r\n0\r\n\r\n`
    ]

    dataList.forEach(chunk => conn.socket.emit('data', chunk))
  })
  test('data event 3', () => {
    const conn = new Connection();

    conn.send({}, function (data) {
      expect(data).toBe(RESPONSE_TEXT)
    })

    const dataList = [
      [`HTTP/1.1 200 OK\r\n`,
        `Transfer-Encoding: chunked\r\n`,
        `X-Dubbo-Attachments: dubbo=3.3.0\r\n`,
        `X-Routed-To: 10.215.30.57:7100\r\n`,
        `Date: Mon, 08 Feb 2021 08:57:48 GMT\r\n`,
        `Content-Type: text/plain; charset=utf-8\r\n`,
        `Connection: keep-alive\r\n`,
        `Keep-Alive: timeout=5\r\n\r\n`,
        `e\r\n`,
        `{\n    "code": \r\n`
      ].join(''),
      `19\r\n0,\n    "msg": "ok",\n    "\r\n`,
      `1e\r\ndata": [{\n      "code": "+86",\r\n`,
      `1e\r\n\n      "eng": "china",\n      "\r\n`,
      `1a\r\nname": "中国",\n      "zh\r\n`,
      `1a\r\n": "zhongguo"\n    }, {\n   \r\n`,
      `b\r\n   "code": \r\n`,
      `17\r\n"+54",\n      "eng": "Ar\r\n`,
      `18\r\ngentina",\n      "name": \r\n`,
      `15\r\n"阿根廷",\n      "z\r\n`,
      `18\r\nh": "agenting"\n    }]\n  \r\n`,
      `1\r\n}\r\n0\r\n\r\n`
    ]

    dataList.forEach(chunk => conn.socket.emit('data', chunk))
  })

  test('parse chunk', () => {
    const conn = new Connection();
    conn.parseChunk('3\r\n  }\r\n0\r\n\r\n')
    expect(conn.data).toBe('  }')
    conn.release();
    conn.parseChunk('11\r\n  "name": "中国\r\n')
    expect(conn.data).toBe('  "name": "中国')
    conn.release();
    conn.parseChunk(`13\r\n\n{\n  "code": 0\r\n1a\r\n,\n  "msg": "ok",\n  "da\r\n`)
    expect(conn.data).toBe(`\n{\n  "code": 0,\n  "msg": "ok",\n  "da`)
    conn.release()
    conn.parseChunk(`1\r\n}\r\n0\r\n\r\n`)
    expect(conn.data).toBe(`}`)
  })
})