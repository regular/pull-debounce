'use strict';

module.exports = function debounce (ms) {
  var timeout = null
  var queue = []
  var ended = false
  var readPending = false
  var candidate = null

  function callback(end, data) {
    if (queue.length) queue.shift()(end, data)
  }

  return function(read) {
    var timeoutWon = false
    return function next (end, cb) {
      if (cb) queue.push(cb)
      if (ended) return callback(ended);
      if (readPending) return;
      if (end) return read(end, callback);
      ended = ended || end;

      readPending = true
      read(end, function (end, data) {
        readPending = false
        if (end) {
          // always emit last item
          ended = end;
          return callback(null, candidate)
        }
        candidate = data
        if (timeoutWon) {
          timeoutWon = false
          if (!queue.length) return
        }
        clearTimeout(timeout);
        
        timeout = setTimeout(function() {
          timeoutWon = true
          callback(null, candidate);
        }, ms)

        return next(end)
      })
    }
  }
}
