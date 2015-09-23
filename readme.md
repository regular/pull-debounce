# pull-debounce
[![NPM](https://nodei.co/npm/pull-debounce.png)](https://nodei.co/npm/pull-debounce/)

`pull-debounce' is a through stream that can be used to debounce a stream of updates, i.e. frequent, overriding updates are being throttled to a desired frequency by dropping intermediate updates.

## Example

``` ks
var pull = require('pull-stream')
var debounce = require('pull-debounce')

function timedSource(data) {
  return pull(
    pull.values(data),
    pull.asyncMap(function(item, cb) {
      setTimeout(function() {
        cb(null, item[1])
      }, item[0]);
    })
  )
}
// => 0,2,3,5
```

This is a (very) thin layer on top of pull-window.

## License
MIT
