import {$message} from '@/utils/prototype/vue.js';

export function asterisk(phone) { //手机号用星号代替
	var regPos = /^\d+(\.\d+)?$/; //非负浮点数
	var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
	if (regPos.test(phone) || regNeg.test(phone)) {
		return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
	} else {
		var s = phone.substr(0, 1)
		var d = phone.substr(phone.length - 1, 1)
		return s + '***' + d
	}

}

// 手机号正则验证
export function phoneValidation(phone) {
  var rePhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (phone == '') {
    $message.alert('手机号不能为空!')
    return false;
  } else if (rePhone.test(phone)) {
    return true
  } else {
    $message.alert('请输入正确的手机号');
    return false;
  }
}
