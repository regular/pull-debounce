'use strict';

module.exports = function debounce (ms) {
  let timeout = null;
  let start = Date.now();
  let queue = [];
  let ended = false;

  return read => {
    let timeoutWon = false;
    return function next (end, cb) {
      if (end) return read(end, cb);
      ended = ended || end;
      if (ended) return cb(end);
      if (queue.length) {
        let result = queue.shift();
        console.log('unqueue', result);
        return cb(result[0], result[1]);
      }
      read(end, function (end, data) {
        let t = Date.now() - start;
        if (timeoutWon) {
          timeoutWon = false;
          console.log('timeout won, queueing', data);
          return queue.push([end, data]);
        }
        console.log('Cleaning timout');
        clearTimeout(timeout);
        if (end) {
          console.log(t, data, 'calling cb because end');
          return cb(end, data);
        }

        timeout = setTimeout(() => {
          let t = Date.now() - start;
          console.log(t, data, 'calling cb (timeout)');
          timeoutWon = true;
          cb(end, data);
        }, ms);

        console.log('setTimeout after', ms, 'for', data);
        return next(end, cb);
      });
    };
  };
};
