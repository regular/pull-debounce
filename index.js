'use strict';

module.exports = function debounce (ms) {
  let timeout = null;
  let queue = [];
  let ended = false;
  let readPending = false;
  let candidate = null;

  function callback(end, data) {
    if (queue.length) {
      queue.shift()(end, data);
    }
  }

  return read => {
    let timeoutWon = false;
    return function next (end, cb) {
      if (cb) {
        queue.push(cb);
      }
      if (ended) return callback(ended);
      if (readPending) {
        return;
      }
      if (end) return read(end, callback);
      ended = ended || end;
      readPending = true;
      read(end, function (end, data) {
        readPending = false;
        if (end) {
          // always emit last item
          ended = end;
          return callback(candidate[0], candidate[1]);
        }
        candidate = [end, data];
        if (timeoutWon) {
          timeoutWon = false;
          if (queue.length === 0) return;
        }
        clearTimeout(timeout);
        if (end) {
          return callback(end, data);
        }

        timeout = setTimeout(() => {
          timeoutWon = true;
          callback(candidate[0], candidate[1]);
        }, ms);

        return next(end);
      });
    };
  };
};
