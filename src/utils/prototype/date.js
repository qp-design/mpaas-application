/**
 * created by zxl
 * 日期累加
 * @param strInterval: 在开始日期上累加的类型，y(年)，m(月)，w(周)，d(天)，h(小时)，n(分钟))，s(秒)
 * @param count: 设置数字，可以是负数
 * @param fmt: 格式化
 */
function add(strInterval, count, fmt) {
  let startDate = Date.parse(this)
  let dtTmp = null
  switch (strInterval.toLowerCase()) {
    case 'second':
    case 's':
      dtTmp = new Date(startDate + 1000 * count)
      break
    case 'minute':
    case 'n':
      dtTmp = new Date(startDate + 60000 * count)
      break
    case 'hour':
    case 'h':
      dtTmp = new Date(startDate + 3600000 * count)
      break
    case 'day':
    case 'd':
      dtTmp = new Date(startDate + 86400000 * count)
      break
    case 'week':
    case 'w':
      dtTmp = new Date(startDate + 86400000 * 7 * count)
      break
    case 'month':
    case 'm':
      dtTmp = new Date(
        this.getFullYear(),
        this.getMonth() + count,
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds()
      )
      break
    case 'year':
    case 'y':
      dtTmp = new Date(
        this.getFullYear() + count,
        this.getMonth(),
        this.getDate(),
        this.getHours(),
        this.getMinutes(),
        this.getSeconds()
      )
      break
  }
  if (fmt) {
    return dtTmp.format(fmt)
  }
  return dtTmp
}

/**
 * 日期减
 * @param {*} strInterval
 * @param {*} count
 * @param {*} fmt
 */
function minus(strInterval, count, fmt) {
  return this.add(strInterval, count * -1, fmt)
}

/**
 * created by zxl
 * 格式化日期
 * @param fmt
 */
function format(fmt) {
  let date = this
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
/**
 * 大后天、后天、明天、今天、昨天、前天、大前天的某一天
 */
function whichDay() {
  let date = cdate
  let cdate = this.format('yyyy-MM-dd')
  switch (cdate) {
    case new Date().format('yyyy-MM-dd'):
      date = '今天'
      break
    case this.minus('d', 1, 'yyyy-MM-dd'):
      date = '昨天'
      break
    case this.minus('d', 2, 'yyyy-MM-dd'):
      date = '前天'
      break
    case this.minus('d', 3, 'yyyy-MM-dd'):
      date = '大前天'
      break
    case this.add('d', 1, 'yyyy-MM-dd'):
      date = '明天'
      break
    case this.add('d', 2, 'yyyy-MM-dd'):
      date = '后天'
      break
    case this.add('d', 3, 'yyyy-MM-dd'):
      date = '大后天'
      break
  }
  return date
}

/**
 * 取两个日期中最大值
 * @param {*} date1
 * @param {*} date2
 */
function max(date1, date2) {
  if (date1 && date2) {
    let date = Math.max(Date.parse(date1), Date.parse(date2))
    return new Date(date)
  }
  return null
}

/**
 * 取两个日期中最小值
 * @param {*} date1
 * @param {*} date2
 */
function min(date1, date2) {
  if (date1 && date2) {
    let date = Math.min(Date.parse(date1), Date.parse(date2))
    return new Date(date)
  }
  return null
}
function add0(m) {
  return m < 10 ? '0' + m : m
}

export function formatDate(stamp) {
  // shijianchuo是整数，否则要parseInt转换
  var time = new Date(stamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + '  ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}
export function formatTimes(stamp) {
  // shijianchuo是整数，否则要parseInt转换
  var time = new Date(stamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return y + '-' + add0(m) + '-' + add0(d)
}

export function formatPhone(stamp) {
  var dh = stamp.substr(0, 3) + "******" + stamp.substr(8);
  return dh;
}

export default function addDatePrototypes() {
  Object.defineProperties(Date.prototype, {
    add: { value: add },
    minus: { value: minus },
    format: { value: format },
    whichDay: { value: whichDay }
  })
  Object.defineProperties(Date, {
    min: { value: min },
    max: { value: max }
  })
}
