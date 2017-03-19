'use strict';

module.exports = function debounce (ms) {
  let timeout = null;
  let start = Date.now();
  let queue = [];
  let ended = false;
  let readPending = false;
  let candidate = null;

  function callback(end, data) {
    console.log('callback q', queue.length);
    if (queue.length) {
      queue.shift()(end, data);
    }
  }

  return read => {
    let timeoutWon = false;
    return function next (end, cb) {
      console.log('next called');
      if (cb) {
        console.log('queueing callback');
        queue.push(cb);
      }
      if (ended) return callback(ended);
      if (readPending) {
        console.log('read pending. returning');
        return;
      }
      if (end) return read(end, callback);
      ended = ended || end;
      console.log('calling read');
      readPending = true;
      read(end, function (end, data) {
        readPending = false;
        console.log('read done, new candidate:', end, data);
        if (end) {
          // always emit last item
          ended = end;
          return callback(candidate[0], candidate[1]);
        }
        let t = Date.now() - start;
        candidate = [end, data];
        if (timeoutWon) {
          timeoutWon = false;
          console.log('timeout won');
          if (queue.length === 0) return;
        }
        console.log('Cleaning timout');
        clearTimeout(timeout);
        if (end) {
          console.log(t, data, 'calling cb because end');
          return callback(end, data);
        }

        timeout = setTimeout(() => {
          let t = Date.now() - start;
          console.log(t, data, 'calling cb (timeout)');
          timeoutWon = true;
          callback(candidate[0], candidate[1]);
        }, ms);

        console.log('setting Timeout after', ms, 'for', data, 'calling next');
        return next(end);
      });
    };
  };
};
