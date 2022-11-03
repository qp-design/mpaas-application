import url from '@/api/configCheck.js'
import moment from 'moment'
import http from '@/api/http.js';
import {
  getProappinfo
} from '@/api/interface.js';
export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          // 胶囊位置
          paddingTop: '0rpx',
          logoHeight: '0rpx',
          bigPadding: '0rpx',
          carPadding: '0rpx',

          baseColor: "#EB2B27",
          baseUrl: url.domain,
          defaultImgUrl: "@/static/common/dontHav.png"
        }
      },
      methods: {
        // 金额过滤
        money(val) {
          var val = val + "";
          // var val = val.toString();
          if (val.indexOf('.') == -1) {
            return "<b style='font-size:1.1em'>￥" + val + "<b style='font-size:0.8em'>.00</b></b>";
          } else if (val.substr(val.indexOf('.')).length == 2) {
            return "<b style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) + "<b style='font-size:0.8em'>" +
              val.substr(
                val.indexOf('.')) + '0</b></b>';
          } else {
            return "<b style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) + "<b style='font-size:0.8em'>" +
              val.substr(
                val.indexOf('.'), 3) + '</b></b>';
          }
        },
        // 金额过滤
        thinMoney(val) {
          var val = val + "";
          // var val = val.toString();
          if (val.indexOf('.') == -1) {
            return "<span style='font-size:1.1em'>￥" + val + "<span style='font-size:0.8em'>.00</span></span>";
          } else if (val.substr(val.indexOf('.')).length == 2) {
            return "<span style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) +
              "<span style='font-size:0.8em'>" + val.substr(
                val.indexOf('.')) + '0</span></span>';
          } else {
            return "<span style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) +
              "<span style='font-size:0.8em'>" + val.substr(
                val.indexOf('.'), 3) + '</span></span>';
          }
        },
        // 胶囊位置计算
        positionCalc() {
          // 微信小程序获取菜单按钮（右上角胶囊按钮）位置信息 (单位px)
          // #ifndef H5
          var data = wx.getMenuButtonBoundingClientRect();
          this.paddingTop = data.top * 2 + 4 + 'rpx';
          this.logoHeight = data.height * 2 + 'rpx';
          this.bigPadding = (data.top + data.height + 45) * 2 + 'rpx';
          this.carPadding = (data.top + data.height) * 2 + 'rpx';
		  this.detailPadding = (data.top + data.height + 12) * 2 + 'rpx';
		  console.log('自定义头部高度',this.detailPadding)
          console.log('菜单按键宽度：', data.width);
          console.log('菜单按键高度：', data.height);
          console.log('菜单按键上边界坐标：', data.top);
          console.log('菜单按键右边界坐标：', data.right);
          console.log('菜单按键下边界坐标：', data.bottom);
          console.log('菜单按键左边界坐标：', data.left);
          // #endif
        },

        goBack() {
		  this.$routers.back()
        },
        jumpToSearch(e) {
		  this.$routers.push('search')
        },
        //时间处理
        handleTime(val,str = 'YYYY-MM-DD hh:mm:ss') {
          return moment(val).format(str)
        },
        // 富文本处理
        richTextFilter(val) {
          if (val) {
            var str = val + "";
            var arr = str.split("<img");
            arr.map((item, index) => {
              console.log(item)
              if (item.indexOf("http") == -1 && item.length != 0) {
                return arr[index] = item.replace(/src="/, 'style="width:100%" src="' + this.baseUrl)
              } else {
                return arr[index] = item.replace(/src="/, 'style="width:100%" src="')
              }
            })
            return arr.join("<img")
          }
        },
		//数组切割
		split_array(arr, len){    
			var a_len = arr.length;   
			var result = [];    
			for(var i=0;i<a_len;i+=len){
				result.push(arr.slice(i,i+len));
				}    
			return result;
		}
      },
      filters: {
        urlFilter(val) {
          var val = val + "";
          if (val.indexOf("http") != -1) {
            return val
          } else {
            return url.domain + val;
          }
        },
        // 保留两个小数
        keepDecimals(val) {
          return val.toFixed(2)
        }
      }
    })
  }
}
