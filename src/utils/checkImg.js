export function checkImgUrl(str) {
  if (!RegExp(/http/).test(str)) {
    return $domain + str
  } else {
    return str
  }
}