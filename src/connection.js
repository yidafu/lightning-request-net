const net = require('net');
const debug = require('debug')('conn:');

const defaultIdelTimeout = 3 * 60 * 1000 - 5 * 1000;

function loop() {}

class Connection {
  get defaultOptions() {
    return {
      keepAlive: true,
      idleTimeout: defaultIdelTimeout,
    };
  }

  get destroyed() {
    return this.socket.destroyed;
  }

  constructor(options = {}) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.socket = null;
    this.ready = false;
    this.writeCacheData = null;
    this.successCall = loop;
    this.failCall = loop;
    this.contentLength = 0;
    this.chunked = false;
    this.bodySize = 0;
    this.data = ''; // received data
    this.dataCount = 0; // received data count
    this.connect();
  }

  parseChunk(chunk) {
    let lastChunkSize = -1;
    let crlfIndex = chunk.indexOf('\r\n');
    let crlfEndIndex = 0;
    while (crlfIndex > -1) {
      lastChunkSize = parseInt(chunk.substring(crlfEndIndex, crlfIndex), 16);
      if (lastChunkSize === 0) {
        break;
      }
      crlfEndIndex = chunk.indexOf('\r\n', crlfIndex + 2);
      const chunkContext = chunk.substring(crlfIndex + 2, crlfEndIndex)

      this.contentLength += parseInt(lastChunkSize, 16)
      this.bodySize += parseInt(lastChunkSize, 16)
      this.data += chunkContext;
      crlfIndex = chunk.indexOf('\r\n', crlfEndIndex + 2);
      crlfEndIndex += 2;
    }
    return lastChunkSize
  }

  connect() {
    this.socket = new net.Socket();
    this.socket.setTimeout(this.options.idleTimeout);
    this.socket.setKeepAlive(this.options.keepAlive);
    this.socket.connect(this.options.port, this.options.host);
    this.socket.setEncoding('utf8');

    this.socket
      .on('lookup', () => {
        // Emitted after resolving the hostname but before connecting. Not applicable to Unix sockets.
        debug('socket event -> lookup');
      })
      .on('connect', () => {
        // Emitted when a socket connection is successfully established.
        debug('socket event -> connect');
      })
      .on('ready', () => {
        // Emitted when a socket is ready to be used.
        debug('socket event -> ready');
        this.ready = true;
        if (this.writeCacheData) {
          this.write(this.writeCacheData);
          this.writeCacheData = null;
        }
      })
      .on('data', chunk => {
        debug('recevie data --> ${%s}', chunk)
        // Emitted when data is received.
        this.dataCount++;
        let chunkSize = -1;
        if (this.dataCount === 1) {
          const contentLengthIndex = chunk.indexOf('Content-Length: ');
          this.chunked = contentLengthIndex === -1;

          if (!this.chunked) {
            this.contentLength = parseInt(chunk.slice(contentLengthIndex + 16, contentLengthIndex + 26).toString());
            const headerTailIndex = chunk.indexOf('\r\n\r\n');
            this.bodySize += Buffer.byteLength(chunk) - headerTailIndex - 4;
            this.data += chunk;
          } else {
            let headerTailIndex = chunk.indexOf('\r\n\r\n');
            this.bodySize += Buffer.byteLength(chunk) - headerTailIndex - 4;
            this.data += chunk.substring(0, headerTailIndex + 4)
            const chunkData = chunk.substring(headerTailIndex + 4)
            chunkSize = this.parseChunk(chunkData)
            this.contentLength += chunkSize + headerTailIndex + 4;
          }
        } else {
          if (!this.chunked) {
            this.bodySize += Buffer.byteLength(chunk);
            this.data += chunk;
          } else {
            chunkSize = this.parseChunk(chunk)
          }
        }

        if ((this.bodySize && this.bodySize >= this.contentLength) || chunkSize === 0) {
          this.successCall(this.data);
          this.release();
        }
      })
      .on('timeout', () => {
        // Emitted if the socket times out from inactivity. This is only to notify that the socket has been idle.
        // The user must manually close the connection.
        debug('socket event -> timeout');
        this.socket.end();
      })
      .on('drain', () => {
        // Emitted when the write buffer becomes empty. Can be used to throttle uploads.
        debug('socket event -> drain');
      })
      .on('end', () => {
        // Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
        debug('socket event -> end');
      })
      .on('error', err => {
        // Emitted when an error occurs. The 'close' event will be called directly following this event.
        debug('socket event -> error');
        this.failCall(err);
      })
      .on('close', () => {
        // Emitted once the socket is fully closed.
        // The argument hadError is a boolean which says if the socket was closed due to a transmission error.
        debug('socket event -> close');
        this.ready = false;
        this.release();
        if (!this.socket.destroyed) {
          this.socket.destroy();
        }
      });
  }

  release() {
    this.writeCacheData = null;
    this.successCall = loop;
    this.failCall = loop;
    this.contentLength = 0;
    this.chunked = false;
    this.bodySize = 0;
    this.data = '';
    this.dataCount = 0;
  }

  send(data, successCall, failCall) {
    this.successCall = successCall;
    this.failCall = failCall;
    debug('socket ready status check');
    if (this.ready) {
      this.write(data);
    } else {
      debug('data temporary cache');
      this.writeCacheData = data;
    }
  }

  write(data) {
    debug('socket start send');
    const result = this.socket.write(data, 'utf8', function(err) {
      debug('socket data is finally written out');
    });
    debug('socket write call result:', result);
    if (!result) {
    }
  }
}

module.exports = Connection;
