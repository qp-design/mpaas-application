/**
 * 移除对象的key
 * @param {*} key
 */
function remove(key) {
  if (typeof this === 'object') {
    let obj = this
    if (!key) {
      return obj || {}
    }
    delete obj[key]
    return obj
  }
  return {}
}

/**
 * 深拷贝对象
 */
function copy() {
  return JSON.parse(JSON.stringify(this))
}

/**
 * 去除重复的子元素
 */
function single() {
  return Array.from(new Set(this))
}

/**
 * 转字符串
 */
function stringify() {
  return JSON.stringify(this)
}

export default function addObjectPrototype() {
  // 直接将copy和remove绑定到root上
  Object.defineProperties(Object.prototype, {
    copy: { value: copy },
    remove: { value: remove },
    stringify: { value: stringify }
  })
  Object.defineProperties(Array.prototype, {
    copy: { value: copy },
    single: { value: single }
  })
}
