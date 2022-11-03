export function timesSeconds(timestamp) {
	if (!timestamp) {
		return;
	}
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	const Y = date.getFullYear() + ".";
	const M =
		(date.getMonth() + 1 < 10 ?
			"0" + (date.getMonth() + 1) :
			date.getMonth() + 1) + ".";
	const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var h = null;
	var m = null;
	var s = null;
	if (date.getHours()) {
		h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	} else {
		h = "00";
	}
	if (date.getMinutes()) {
		m =
			date.getMinutes() < 10 ?
			":" + "0" + date.getMinutes() :
			":" + date.getMinutes();
	} else {
		m = ":00";
	}
	if (date.getSeconds()) {
		s =
			date.getSeconds() < 10 ?
			":" + "0" + date.getSeconds() :
			":" + date.getSeconds();
	} else {
		s = ":00";
	}
		return Y + M + D  ;
	
}
export function timestampToTime(timestamp) {
  const date = new Date(timestamp);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() < 10 ? "0" + date.getDate() + ' ' : date.getDate() + ' ';
  let h = null;
  let m = null;
  let s = null;
  if (date.getHours()) {
    h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  } else {
    h = '00' + ':';
  }
  if (date.getMinutes()) {
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  } else {
    m = '00' + ':';
  }
  if (date.getSeconds()) {
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  } else {
    s = '00';
  }
  return Y + M + D + h + m + s;
}
