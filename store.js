var assert = require("assert");
var debug = require("debug")("socket.io-store");
var redisClient;
var prefix;

var validateOptions = function (options) {
	if (options && options.prefix) {
		assert(typeof options.prefix === "string", "Invalid prefix: prefix must be a string");
	}
};

function SocketStore (socketId, options) {
	if (!(this instanceof SocketStore)) {
		return new SocketStore(socketId, options);
	}
	options || (options = {});
	validateOptions(options);

	if (!socketId) {
		throw new Error("Missing required socket id");
	}
	this.socketId = socketId;

	if (options.redisClient) {
		this.redisClient = options.redisClient;
	}
	else if (redisClient) {
		this.redisClient = redisClient;
	}

	// At this point, we cannot wait for the redis client any longer
	assert(this.redisClient, "Missing required redis client");

	if (options.prefix) {
		this._prefix = options.prefix;
	}
	else if (prefix) {
		this._prefix = prefix;
	}
	else {
		this._prefix = "__socket.io-store";
	}
	debug("Socket store created for socket %s with prefix %s", this.socketId, this._prefix);
}

var defaultCallback = function (err) {
	if (err) {
		debug(err);
	}
};

SocketStore.prototype._createKey = function () {
	var parts = [].slice.call(arguments);
	parts.unshift(this._prefix, this.socketId);
	return parts.join(":");
};

SocketStore.prototype.get = function (key, cb) {
	this.redisClient.get(this._createKey(key), cb);
};

SocketStore.prototype.set = function (key, value, cb) {
	cb || (cb = defaultCallback);
	this.redisClient.set([this._createKey(key), value], cb);
};

SocketStore.prototype.has = function (key, cb) {
	this.redisClient.exists(this._createKey(key), cb);
};

SocketStore.prototype.del = function (key, cb) {
	cb || (cb = defaultCallback);
	this.redisClient.del(this._createKey(key), cb);
};

module.exports = SocketStore;

module.exports.initialize = function (options) {
	if (!options) {
		return;
	}

	validateOptions(options);

	if (options.redisClient) {
		redisClient = options.redisClient;
	}

	if (options.prefix) {
		prefix = options.prefix;
	}
};

var implementedMethods = ["get", "set", "has", "del"];

module.exports.middleware = function (options) {
	validateOptions(options);
	return function (socket, next) {
		var store = new SocketStore(socket.id, options);
		implementedMethods.forEach(function (method) {
			socket[method] = store[method].bind(store);
		});
		next();
	};
};
