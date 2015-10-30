<a name="SocketStore"></a>
## SocketStore
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| redisClient | <code>Object</code> | Redis client |
| _prefix | <code>String</code> | Prefix to use for namespacing the keys                            saved to redis |


* [SocketStore](#SocketStore)
  * [new SocketStore(socketId, [options])](#new_SocketStore_new)
  * _instance_
    * [.get(key, cb)](#SocketStore+get)
    * [.set(key, value, [cb])](#SocketStore+set)
    * [.has(key, cb)](#SocketStore+has)
    * [.del(key, cb)](#SocketStore+del)
  * _static_
    * [.initialize([options])](#SocketStore.initialize)
    * [.middleware([options])](#SocketStore.middleware) ⇒ <code>[middleware](#SocketStore..middleware)</code>
  * _inner_
    * [~getCallback](#SocketStore..getCallback) : <code>function</code>
    * [~setCallback](#SocketStore..setCallback) : <code>function</code>
    * [~hasCallback](#SocketStore..hasCallback) : <code>function</code>
    * [~deleteCallback](#SocketStore..deleteCallback) : <code>function</code>
    * [~middleware](#SocketStore..middleware) : <code>function</code>

<a name="new_SocketStore_new"></a>
### new SocketStore(socketId, [options])
Redis-backed store matching the socket.io pre-v1.x api


| Param | Type | Description |
| --- | --- | --- |
| socketId | <code>String</code> | The socket session id |
| [options] | <code>Object</code> |  |
| [options.redisClient] | <code>Object</code> | Redis client |
| [options.prefix] | <code>String</code> | Prefix to use for namespacing the keys                                  saved to redis |

<a name="SocketStore+get"></a>
### socketStore.get(key, cb)
Get the value of a key

**Kind**: instance method of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to get |
| cb | <code>[getCallback](#SocketStore..getCallback)</code> | The callback |

<a name="SocketStore+set"></a>
### socketStore.set(key, value, [cb])
Set a value for a key

**Kind**: instance method of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to set the value for |
| value | <code>String</code> | The value to set |
| [cb] | <code>[setCallback](#SocketStore..setCallback)</code> | The callback |

<a name="SocketStore+has"></a>
### socketStore.has(key, cb)
Check whether a key exists

**Kind**: instance method of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to check |
| cb | <code>[hasCallback](#SocketStore..hasCallback)</code> | The callback |

<a name="SocketStore+del"></a>
### socketStore.del(key, cb)
Delete a key

**Kind**: instance method of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key to delete |
| cb | <code>[deleteCallback](#SocketStore..deleteCallback)</code> | The callback |

<a name="SocketStore.initialize"></a>
### SocketStore.initialize([options])
Initialize the SocketStore options

**Kind**: static method of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.redisClient] | <code>Object</code> | Redis client |
| [options.prefix] | <code>String</code> | Prefix to use for namespacing the keys                                  saved to redis |

<a name="SocketStore.middleware"></a>
### SocketStore.middleware([options]) ⇒ <code>[middleware](#SocketStore..middleware)</code>
Return socket.io <a href="http://socket.io/docs/server-api/#namespace#use(fn:function):namespace">middleware</a>

**Kind**: static method of <code>[SocketStore](#SocketStore)</code>  
**Returns**: <code>[middleware](#SocketStore..middleware)</code> - fn socket.io middleware  

| Param | Type |
| --- | --- |
| [options] | <code>Object</code> | 

<a name="SocketStore..getCallback"></a>
### SocketStore~getCallback : <code>function</code>
**Kind**: inner typedef of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error or `null` |
| value | <code>String</code> | The value |

<a name="SocketStore..setCallback"></a>
### SocketStore~setCallback : <code>function</code>
**Kind**: inner typedef of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error or `null` |
| set | <code>Number</code> | The number of keys set (0 or 1) |

<a name="SocketStore..hasCallback"></a>
### SocketStore~hasCallback : <code>function</code>
**Kind**: inner typedef of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error or `null` |
| has | <code>Number</code> | 0 if key does not exist, 1 if key exists |

<a name="SocketStore..deleteCallback"></a>
### SocketStore~deleteCallback : <code>function</code>
**Kind**: inner typedef of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> &#124; <code>null</code> | An error or `null` |
| deleted | <code>Number</code> | The number of keys deleted |

<a name="SocketStore..middleware"></a>
### SocketStore~middleware : <code>function</code>
**Kind**: inner typedef of <code>[SocketStore](#SocketStore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Object</code> | A socket.io socket |
| next | <code>function</code> |  |

