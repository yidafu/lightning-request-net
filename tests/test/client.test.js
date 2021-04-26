const HttpRequestClient = require("../src/client")
const {startServer, closeServer} = require('./mock-service')

describe('HttpRequestClient', () => {
  test('standar request', async () => {
    startServer(8485)
    const client = new HttpRequestClient({
      host: '127.0.0.1',
      port: 8485,
    });

    const resp = await client.request({
      method: 'GET',
      path: '/index'
    });

    expect(resp.data.code).toBe(0);

    closeServer(8485)
  })

  test('chunk encoding', async () => {
    startServer(8485)
    const client = new HttpRequestClient({
      host: '127.0.0.1',
      port: 8485,
    });

    const resp = await client.request({
      method: 'GET',
      path: '/chunks'
    });

    expect(resp.data.code).toBe(0);

    closeServer(8485)
  })
})
