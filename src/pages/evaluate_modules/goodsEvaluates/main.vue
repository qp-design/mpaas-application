<template>
  <div class="evaluateList">
    <div class="bgcolor" :style="{ height: scroll_height + 'rpx' }">
      <div class="evaluateList-box">
        <ul v-if="evaluateList.length != 0">
          <view v-for="(evaluate, index) in evaluateList" :key="index">

            <li v-if="evaluate.evaluateGoodsShow">
              <div class="box-con">
                <div class="box-tit">
                  <div class="box-left">
                    <img v-if='evaluate.userImgurl' :src="checkImgUrl(evaluate.userImgurl)" />
					<div v-else class="imgNull"></div>
                    <div>
                      <h3>{{ evaluate.memberBname }}</h3>
                      <view class="p_list" v-if="evaluate.evaluateAddImg1==0">
                        <view class="active_item">好评</view>
                      </view>
                      <view class="p_list" v-if="evaluate.evaluateAddImg1==1">
                        <view class="active_item">中评</view>
                      </view>
                      <view class="p_list" v-if="evaluate.evaluateAddImg1==2">
                        <view class="active_item">差评</view>
                      </view>
                    </div>
                  </div>
                  <div class="box-right">
                    {{handleTime(evaluate.gmtCreate ,'YYYY-MM-DD')}}
                  </div>
                </div>
                <div class="box-info">{{ evaluate.evaluateGoodsContent }}</div>
                <view class="box-img-show" v-if="evaluate.evaluateGoodsImgsList">
                  <view class="box-img" v-for="(item1, index1) in evaluate.evaluateGoodsImgsList" :key="index1">
                    <image :src="checkImgUrl(item1)" mode="" v-if="item1&&item1!='null'" @click="imgClick(checkImgUrl(item1),evaluate.evaluateGoodsImgsList)"></image>
                  </view>
                </view>

                <div class="reply" v-show="evaluate.shopReply.length > 0">
                  <i class="iconfont">&#xe766;</i>
                  <p>客服回复：{{ evaluate.shopReply && evaluate.shopReply[0] ? evaluate.shopReply[0].evaluateReplyContent : '' }}</p>
                </div>
              </div>
            </li>
          </view>
        </ul>
        <h3 class="noel" v-if="evaluateList.length == 0">暂无此商品评价</h3>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '@/api/http.js';
  import {
    $storage,
    $routers
  } from '@/utils/prototype/vue.js';
  import {
    evaluate
  } from '@/api/interface.js';
  import commonHeader from '@/components/communal/commonHeader';
  import {
    formatDate
  } from '@/utils/prototype/date.js';
  import {
    checkImgUrl
  } from '@/utils/checkImg.js'
  export default {
    data() {
      return {
        checkImgUrl,
        title: '全部评价',
        leftIcon: true,
        rightIcon: false,
        evaluateList: [],
        userImgurl: require('@/static/img/mine/default_header.png'),
        scroll_height: ''
      };
    },
    onLoad(options) {
      console.log(options)
      wx.setNavigationBarTitle({
        title: this.title
      });
      $storage.set('htmlMessage', options);
      http.post(evaluate, options).then(res => {
        this.evaluateList = res.rows;
		
        this.evaluateList.map(v => {
          v.gmtCreate = formatDate(v.gmtCreate);
          v.memberBname = v.memberBname.substring(0, 1) + '***' + v.memberBname.substring(v.memberBname.length -
            1);

        });
      });
      var that = this;
      wx.getSystemInfo({
        //微信自身api
        success: function(res) {
          that.scroll_height = res.screenHeight * 2;
          // that.listHeight = res.screenHeight * 2 - 640;
        }
      });
    },
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
    mounted() {},
    components: {
      commonHeader
    },
    methods: {
      imgClick(e,es){
		es.map((item,i) => {
			if(item.indexOf('http') == -1&&item){
				es[i] = this.$domain + item
			}
		})
        uni.previewImage({
          urls: es, //需要预览的图片http链接列表，注意是数组
          current: e, // 当前显示图片的http链接，默认是第一个
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
	  },
    }
  };
</script>

<style lang="less" scoped>
  @import '@/common/css/common.less';

  .bgcolor {
    background: @white-color;
  }

  .noel {
    text-align: center;
    margin-top: 200rpx;
    font-size: 26rpx;
    color: #999999;
  }

  .p_list {
    display: flex;
    align-items: center;

    view {
      width: 66rpx;
      height: 30rpx;
      font-size: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20rpx;
      margin-right: 26rpx;
    }

    .active_item {
      line-height: 38rpx;
      color: #fff;
      background: #FFA043;
      box-shadow: 1px 1px 10px 0px rgba(51, 51, 51, 0.15);
    }

    .tab_item {
      line-height: 36rpx;
      background: #FFFFFF;
      border: 1px solid #FFA043;
      color: #FFA043;

    }
  }

  .evaluateList {
    width: 100%;
    background: @white-color;

    .evaluateList-box {

      // margin-top: 90rpx;
      ul {
        li {
          padding: 30rpx 0;
          border-bottom: 1rpx solid #f6f6f8;

          .box-con {
            padding: @padding-30;

            .box-tit {
              display: flex;
              align-items:center;
              justify-content: space-between;

              .box-left {
                display: flex;
                align-items: center;
				
				.imgNull{
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					margin-right: 16rpx;
					background-color: rgba(0,0,0,0.5);
				}
				
                p {
                  font-size: 20rpx;
                  color: @color-999;
                }

                img {
                  width: 70rpx;
                  height: 70rpx;
                  border-radius: 50%;
                  margin-right: 16rpx;
                }

                h3 {
                  color: #252525;
                  font-size: @big-title;
                }
              }

              .box-right {
                font-size: 18rpx;
                color: #999999;
              }
            }

            .box-info {
              font-size: @top-title;
              color: @color-333;
              margin: 32rpx 0 14rpx 0;
            }

            .box-img-show {
              width: 100%;
              display: flex;
              margin-bottom: 20rpx;

              .box-img {
				  margin-left: 15rpx;
                image {

                  width: 200rpx;
                  height: 200rpx;
                }
              }
            }

            ol {
              overflow: hidden;
              zoom: 1;

              li {
                width: 214rpx;
                height: 214rpx;
                margin-right: 24rpx;
                float: left;

                img {
                  width: 214rpx;
                  height: 214rpx;
                }

                &:nth-child(3n) {
                  margin-right: 0;
                }
              }
            }

            .reply {
              background: #f6f6f6;
              border-radius: 2rpx;
              position: relative;
              padding: 20rpx;

              p {
                line-height: 40rpx;
                font-size: @middle-title;
                color: @color-666;
              }

              i {
                color: #f6f6f6;
                position: absolute;
                top: -26rpx;
                left: 42rpx;
              }
            }
          }
        }
      }
    }
  }
</style>
