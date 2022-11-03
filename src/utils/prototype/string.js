/**
 * 去除左右空格
 */
function trim() {
	let str = this
	if (!this.length) {
		return ''
	}
	let exists = false
	if (str.substr(0, 1) === ' ') {
		exists = true
		str = str.substr(1)
	}
	if (str.substr(str.length - 1, 1) === ' ') {
		exists = true
		str = str.substr(0, str.length - 1)
	}
	if (exists) {
		return str.trim()
	} else {
		return str
	}
}

/**
 * 字符串全文替换
 * @param {*} str
 * @param {*} taget
 */
function replaceAll(str, taget) {
	return this.replace(new RegExp(str, 'g'), taget)
}

function joinStart(targetLength, joinStr) {
	let str = this;
	if (!str.length) {
		return ''
	}
	if (targetLength <= str.length) {
		return str
	}
	let beforeLength = str.length
	for (let i = 0; i < (targetLength - beforeLength); i++) {
		str = joinStr + str
	}
	return str
}

function joinEnd(targetLength, joinStr) {
	let str = this;
	if (!str.length) {
		return ''
	}
	if (targetLength <= str.length) {
		return str
	}
	let beforeLength = str.length
	for (let i = 0; i < (targetLength - beforeLength); i++) {
		str = str + joinStr
	}
	return str
}

export default function addStringPrototype() {
	Object.defineProperties(String.prototype, {
		trim: {
			value: trim
		},
		replaceAll: {
			value: replaceAll
		},
		joinStart: {
			value: joinStart
		},
		joinEnd: {
			value: joinEnd
		}
	})
}
