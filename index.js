// jshint -W083
var pull = require('pull-stream')
var window = require('pull-window')

module.exports = function(time) {
  return pull(
    window.recent(null, time),
    pull.map(function(item) {
      return item.pop()
    })
  )
}
