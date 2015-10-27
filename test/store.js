var assert = require("assert");
var http = require("http");
var redis = require("redis");
var debug = require("debug")("test");

describe("store", function () {
	var server;
	var client;
	var redisClient = redis.createClient();
	var io;
	var keyPrefix = "test:__socket.io-store";

	before("initialize redis keyspace", function (done) {
		redisClient.del(keyPrefix + ":*", done);
	});

	afterEach("clean up redis keyspace", function (done) {
		redisClient.del(keyPrefix + ":*", done);
	});

	beforeEach("create app", function (done) {
		var socket = require("socket.io");
		var SocketStore = require("../");

		SocketStore.initialize({ redisClient: redisClient, prefix: keyPrefix });

		server = http.createServer();
		io = socket(server);
		io.use(SocketStore.middleware());

		server.listen(0, done);
	});

	beforeEach("create socket.io client", function (done) {
		var port = server.address().port;
		debug("server listening on port %s", port);
		client = require("socket.io-client")("http://localhost:" + port, { forceNew: true });
		client.once("connect", function () {
			debug("socket.io client id: %s", client.id);
		});
		client.on("connect", done);
	});

	afterEach("destroy socket.io client", function () {
		client.disconnect();
	});

	afterEach("destroy server", function (done) {
		server.close(done);
	});

	it("works", function () {
		assert(server);
		assert(client);
		assert(io);

		var _client = io.sockets.connected[client.id];
		["get", "set", "has", "del"].forEach(function (method) {
			assert(typeof _client[method] === "function");
		});
	});

	it("can get", function (done) {
		var attr = "foo" + Math.random();
		var value = "bar" + Math.random();
		var key = keyPrefix + ":" + client.id + ":" + attr;
		var _client = io.sockets.connected[client.id];

		redisClient.set([key, value], function (err) {
			assert.ifError(err);
			_client.get(attr, function (err, result) {
				assert.ifError(err);
				debug("value: %s", value);
				debug("result: %s", result);
				assert.equal(result, value);
				done();
			});
		});
	});

	it("can set", function (done) {
		var attr = "foo" + Math.random();
		var value = "bar" + Math.random();
		var key = keyPrefix + ":" + client.id + ":" + attr;
		var _client = io.sockets.connected[client.id];

		_client.set(attr, value, function (err) {
			assert.ifError(err);
			redisClient.get(key, function (err, result) {
				assert.ifError(err);
				debug("value: %s", value);
				debug("result: %s", result);
				assert.equal(result, value);
				done();
			});
		});
	});

	it("can has", function (done) {
		var attr = "foo" + Math.random();
		var value = "bar" + Math.random();
		var key = keyPrefix + ":" + client.id + ":" + attr;
		var _client = io.sockets.connected[client.id];

		redisClient.set([key, value], function (err) {
			assert.ifError(err);
			_client.has(attr, function (err, result) {
				assert.ifError(err);
				debug("%s result: %s", attr, result);
				assert(result);
				_client.has("other", function (err, result) {
					assert.ifError(err);
					debug("other result: %s", result);
					assert(!result);
					done();
				});
			});
		});
	});

	it("can del", function (done) {
		var attr = "foo" + Math.random();
		var value = "bar" + Math.random();
		var key = keyPrefix + ":" + client.id + ":" + attr;
		var _client = io.sockets.connected[client.id];

		redisClient.set([key, value], function (err) {
			assert.ifError(err);
			_client.del(attr, function (err, result) {
				assert.ifError(err);
				debug("del result: %s", result);
				assert(result);
				redisClient.get(key, function (err, result) {
					assert.ifError(err);
					debug("confirmation result: %s", result);
					assert(!result);
					done();
				});
			});
		});
	});
});
