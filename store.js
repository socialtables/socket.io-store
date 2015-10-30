var assert = require("assert");
var debug = require("debug")("socket.io-store");
var redisClient;
var prefix;

/*
 * Validate an options object
 */
var validateOptions = function (options) {
	if (options && options.prefix) {
		assert(typeof options.prefix === "string", "Invalid prefix: prefix must be a string");
	}
};

/**
 * Redis-backed store matching the socket.io pre-v1.x api
 *
 * @constructor
 *
 * @param {String} socketId The socket session id
 * @param {Object} [options]
 * @param {Object} [options.redisClient] Redis client
 * @param {String} [options.prefix] Prefix to use for namespacing the keys
 *                                  saved to redis
 *
 * @property {Object} redisClient Redis client
 * @property {String} _prefix Prefix to use for namespacing the keys
 *                            saved to redis
 */
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

/*
 * SocketStore#set and SocketStore#del can be used without a callback,
 * so we use this to handle any possible errors
 */
var defaultCallback = function (err) {
	if (err) {
		debug(err);
	}
};

/**
 * @private
 * @memberOf SocketStore
 * @param {...*} Variable number of parts from which to construct a key
 * @returns {String} The key
 */
SocketStore.prototype._createKey = function () {
	var parts = [].slice.call(arguments);
	parts.unshift(this._prefix, this.socketId);
	return parts.join(":");
};

/**
 * Get the value of a key
 *
 * @memberOf SocketStore
 * @param {String} key The key to get
 * @param {SocketStore~getCallback} cb The callback
 */
SocketStore.prototype.get = function (key, cb) {
	this.redisClient.get(this._createKey(key), cb);
};
/**
 * @callback SocketStore~getCallback
 * @param {Error|null} err An error or `null`
 * @param {String} value The value
 */

/**
 * Set a value for a key
 *
 * @memberOf SocketStore
 * @param {String} key The key to set the value for
 * @param {String} value The value to set
 * @param {SocketStore~setCallback} [cb] The callback
 */
SocketStore.prototype.set = function (key, value, cb) {
	cb || (cb = defaultCallback);
	this.redisClient.set([this._createKey(key), value], cb);
};
/**
 * @callback SocketStore~setCallback
 * @param {Error|null} err An error or `null`
 * @param {Number} set The number of keys set (0 or 1)
 */

/**
 * Check whether a key exists
 *
 * @memberOf SocketStore
 * @param {String} key The key to check
 * @param {SocketStore~hasCallback} cb The callback
 */
SocketStore.prototype.has = function (key, cb) {
	this.redisClient.exists(this._createKey(key), cb);
};
/**
 * @callback SocketStore~hasCallback
 * @param {Error|null} err An error or `null`
 * @param {Number} has 0 if key does not exist, 1 if key exists
 */

/**
 * Delete a key
 *
 * @memberOf SocketStore
 * @param {String} key The key to delete
 * @param {SocketStore~deleteCallback} cb The callback
 */
SocketStore.prototype.del = function (key, cb) {
	cb || (cb = defaultCallback);
	this.redisClient.del(this._createKey(key), cb);
};
/**
 * @callback SocketStore~deleteCallback
 * @param {Error|null} err An error or `null`
 * @param {Number} deleted The number of keys deleted
 */

/**
 * Initialize the SocketStore options
 *
 * @static
 * @param {Object} [options]
 * @param {Object} [options.redisClient] Redis client
 * @param {String} [options.prefix] Prefix to use for namespacing the keys
 *                                  saved to redis
 */
SocketStore.initialize = function (options) {
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

/**
 * @typedef {Function} SocketStore~middleware
 * @param {Object} socket A socket.io socket
 * @param {Function} next
 */

/**
 * Return socket.io <a href="http://socket.io/docs/server-api/#namespace#use(fn:function):namespace">middleware</a>
 *
 * @static
 * @param {Object} [options]
 * @returns {SocketStore~middleware} fn socket.io middleware
 */
SocketStore.middleware = function (options) {
	validateOptions(options);
	return function (socket, next) {
		var store = new SocketStore(socket.id, options);
		implementedMethods.forEach(function (method) {
			socket[method] = store[method].bind(store);
		});
		next();
	};
};

module.exports = SocketStore;
