const HttpRequestClient = require('./src/client');

const client = new HttpRequestClient({
  host: '127.0.0.1',
  port: 8484,
});

client.request({
  method: 'GET',
  path: '/index'
})
  .then(console.log)
  .catch(console.error);