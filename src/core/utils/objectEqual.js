module.exports = function shallowEqualObjects(objA, objB) {
  if (objA === objB) {
    return true
  }
  if (typeof objA === 'boolean') return false
  if (typeof objB === 'boolean') return false
  if (objA === null) return false
  if (objB === null) return false
  if (objA === undefined) return false
  if (objB === undefined) return false
  if (typeof objA !== 'object') return false
  if (typeof objB !== 'object') return false

  var aKeys = Object.keys(objA)
  var bKeys = Object.keys(objB)
  var len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i]

    if (objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}
