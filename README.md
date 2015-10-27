# socket.io-store

[![Circle CI](https://circleci.com/gh/socialtables/socket.io-store.svg?circle-token=b3b7a36a481502eb352cc88d527cdb25e2f27266)](https://circleci.com/gh/socialtables/socket.io-store)

Redis-backed store functionality, like socket.io v0.9

# Usage

```js
var io = require("socket.io")();
var SocketStore = require("socket.io-store");
var redis = require("redis");
var redisClient = redis.createClient();

SocketStore.initialize({ redisClient: redisClient });

io.use(SocketStore.middleware());

io.on("connection", function (socket) {

	socket.on("message", function (from, message) {
		var data = JSON.stringify({
			from: from,
			message: message
		});
		socket.set("lastMessage", data, function (err) {
			if (err) {
				socket.emit("error", err);
			}
		});
	});

	socket.on("history", function () {
		socket.get("lastMessage", function (err, data) {
			if (err) {
				socket.emit("error", err);
			}
			else if (data) {
				var message = JSON.parse(data);
				var response = "I last received a message by " + message.from + " saying " + message.message ".";
				socket.emit("history message", response);
				socket.del("lastMessage");
			}
			else {
				socket.emit("history message", "I got nothin'.");
			}
		});
	});
});

```

- - -

Copyright (C) 2015 Social Tables, Inc. (https://www.socialtables.com) All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
