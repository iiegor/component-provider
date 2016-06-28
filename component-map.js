/**
 * This file was extracted from the closure library
 */

/**
 * Helpers
 */
var hasKey = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var cleanupKeysArray = function(map) {
  if (map.count_ != map.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;

    while (srcIndex < map.keys_.length) {
      var key = map.keys_[srcIndex];
      if (hasKey(map.map_, key)) {
        map.keys_[destIndex++] = key;
      }
      srcIndex++;
    }

    map.keys_.length = destIndex;
  }

  if (map.count_ != map.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;

    while (srcIndex < map.keys_.length) {
      var key = map.keys_[srcIndex];
      if (!(goog.structs.Map.hasKey_(seen, key))) {
        map.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }

    map.keys_.length = destIndex;
  }
};

/**
 * goog.iter.Iterator
 */
var Iterator = function() { };

Iterator.prototype.next = function() {
  throw StopIteration;
};

Iterator.prototype.__iterator__ = function() {
  return this;
};

/**
 * goog.iter.StopIteration
 */
var StopIteration = 'StopIteration' in window ? window.StopIteration : {
  message: 'StopIteration',
  stack: ''
};

/**
 * goog.structs.Map
 */
var Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  this.count_ = 0;
  this.version_ = 0;

  var argLength = arguments.length;
  if (argLength > 1) {
    if (argLength % 2) {
      throw Error('Uneven number of arguments');
    }

    for (var i = 0; i < argLength; i += 2) {
      this.set(arguments[i], arguments[i + 1])
    }
  } else if (opt_map) {
    this.addAll(opt_map);
  }
};

var MapProto = Map.prototype;
MapProto.getValues = function() {
  cleanupKeysArray(this);

  var rv = [];
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  
  return rv;
};

MapProto.getKeys = function() {
  cleanupKeysArray(this);

  return this.keys_.concat();
};

MapProto.containsKey = function(key) {
  return hasKey(this.map_, key);
};

MapProto.isEmpty = function() {
  return this.count_ == 0;
};

MapProto.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0;
};

MapProto.remove = function(key) {
  if (hasKey(this.map_, key)) {
    delete this.map_[key];

    this.count_--;
    this.version_++;

    if (this.keys_.length > 2 * this.count_) {
      cleanupKeysArray(this);
    }

    return true;
  }

  return false;
};

MapProto.get = function(key, opt_val) {
  if (hasKey(this.map_, key)) {
    return this.map_[key];
  }

  return opt_val;
};

MapProto.set = function(key, value) {
  if (!hasKey(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++;
  }

  this.map_[key] = value;
};

MapProto.addAll = function(map) {
  var keys, values;

  if (map instanceof Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }

  for (var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i]);
  }
};

MapProto.forEach = function(f, opts_obj) {
  var keys = this.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = this.get(key);
    f.call(opt_obj, value, key, this);
  }
};

MapProto.clone = function() {
  return new Map(this);
};

MapProto.__iterator__ = function(opt_keys) {
  cleanupKeysArray(this);

  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;

  var newIter = new Iterator();
  newIter.next = function() {
    while (true) {
      if (version != selfObj.version_) {
        throw Error('The map has changed since the iterator was created');
      }

      if (i >= keys.length) {
        throw StopIteration;
      }

      var key = keys[i++];
      return opt_keys ? key : map[key];
    }
  };

  return newIter;
};

/**
 * Exported
 */
var id = 'closure_uid_' + (1E9 * Math.random() >>> 0),
  count = 0,
  MapInstance = new Map();

var getMapKey = function(Iface) {
  return Iface[id] || (Iface[id] = ++count);
};

var getMapIface = function(Iface) {
  Iface = getMapKey(Iface);

  return MapInstance.get(Iface);
};