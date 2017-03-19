# pull-debounce
[![NPM](https://nodei.co/npm/pull-debounce.png)](https://nodei.co/npm/pull-debounce/)

debounce for pull-streams

## Example

``` js
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

pull(
  timedSource([
    [0,   0],
    [250, 1],
    [10,  2],
    [250, 3],
    [2000,4],
    [10,  5]
  ]),
  debounce(200),
  pull.log()
)
// => 0,2,3,5
```

## Credits

Many thanks to [@amsross](https://github.com/amsross), who provided valuable feedback, bug reports and code

## License
MIT
