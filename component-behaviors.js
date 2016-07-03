/**
 * Behaviors
 */
var Behaviors = {};

/** @polymerBehavior */
Behaviors.ComponentBehavior = {
  ready: function() {
    if (this.provides) {
      var Iface = this.provides
        , key = getMapKey(Iface);

      if (MapInstance.containsKey(key)) {
        throw Error('Unable to register ' + (this.is || this) + '! Component ' + Iface + ' is already registered!');
      }
      
      MapInstance.set(key, this);
    }
  },

  getInterface: function(Iface) {
    return getMapIface(Iface);
  },

  asyncFrame: function(fn, time) {
    return setTimeout(function() {
      requestAnimationFrame(fn);
    }, time);
  }
};
