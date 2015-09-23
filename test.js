var test = require('tape')
var pull = require('pull-stream')
var debounce = require('.')

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

test('should ignore frquent updates', function(t) {
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
    pull.through(console.log.bind(console)),
    pull.collect(function(end, arr) {
      t.notOk(end)
      t.deepEqual(arr, [0,2,3,5])
      console.log(arr)
      t.end();
    })
  )
})

test('should pass through single item', function(t) {
  pull(
    timedSource([
      [0,   0],
    ]),
    debounce(200),
    pull.through(console.log.bind(console)),
    pull.collect(function(end, arr) {
      t.notOk(end)
      t.deepEqual(arr, [0])
      console.log(arr)
      t.end();
    })
  )
})

test('should pass through single item after timeout', function(t) {
  pull(
    timedSource([
      [250,   0],
    ]),
    debounce(200),
    pull.through(console.log.bind(console)),
    pull.collect(function(end, arr) {
      t.notOk(end)
      t.deepEqual(arr, [0])
      console.log(arr)
      t.end();
    })
  )
})

test('should pass through late last item', function(t) {
  pull(
    timedSource([
      [0,   0],
      [199, 1],
      [2000,2]
    ]),
    debounce(200),
    pull.through(console.log.bind(console)),
    pull.collect(function(end, arr) {
      t.notOk(end)
      t.deepEqual(arr, [1,2])
      console.log(arr)
      t.end();
    })
  )
})

