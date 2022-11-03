export default function set(state, {key, value, isSave}) {
  global[key] = value
  state[key] = value
  if (isSave) {
    wx.setStorageSync(key, value)
  }
}
