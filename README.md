# socket.io-store
Redis-backed store functionality, like socket.io v0.9

# Usage

```js
var io = require("socket.io")();
var SocketStore = require("socket.io-store");
var redis = require("redis");
var redisClient = redis.createClient();

SocketStore.initialize({ redisClient: redisClient });

io.use(SocketStore.middleware());
```
