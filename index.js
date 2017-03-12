'use strict';

module.exports = function debounce (ms) {
  let timeout = null;

  return read => {
    return function next (end, cb) {
      read(end, function (end, data) {
        clearTimeout(timeout);

        if (end) return cb(end, data);

        timeout = setTimeout(() => cb(end, data), ms);
        return next(end, cb);
      });
    };
  };
};
