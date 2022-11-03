<template>
    <view class="evaluateList">
      <view class="evaluateList-box">
		<view class="evaluateList-detail" v-for="(item,index) in items" :key="index">
			<view class="detail-top">
				<view class="detail-left">
					<img v-show="item.userImgurl" :src="checkImgUrl(item.userImgurl)"/>
					<img v-show="!item.userImgurl" src="../../../static/img/mine/default_header.png"/>
				</view>	
				<view class="detail-right">
					<view class="detail-userName">
						{{item.memberBname}}
					</view>
					<view class="detail-spec">
						<view class="detail-spec-left" v-if="item.evaluateAddImg1==0">
							好评
						</view>
						<view class="detail-spec-left" v-if="item.evaluateAddImg1==1">
							中评
						</view>
						<view class="detail-spec-left" v-if="item.evaluateAddImg1==2">
							差评
						</view>
						<!-- <view class="detail-spec-right">
							{{handleTime(item.gmtCreate,'YY-MM-DD')}}
						</view> -->
					</view>
				</view>
				<view class="detail-time">
					{{handleTime(item.gmtCreate,'YYYY-MM-DD')}}
				</view>
			</view>
			<view class="detail-middle">
				{{item.evaluateGoodsContent}}
			</view>
			<view class="detail-img" v-if="item.evaluateGoodsImgs">
				<view class="detailImgs" v-for="(imgs,imgIndex) in item.evaluateGoodsImgs" :key="imgIndex">
				  <img :src="checkImgUrl(imgs)"  @click="imgClick(checkImgUrl(imgs),item.evaluateGoodsImgs)"/>
				</view>
			</view>
			<view class="reply" v-if="item.shopReply">
				  <i class="iconfont">&#xe766;</i>
				  <p>客服回复：{{item.shopReply[0].evaluateReplyContent}}</p>
			</view>
		</view>  
		
        
      </view>
    </view>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$routers} from '@/utils/prototype/vue.js'
import {getAllComment} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import {formatDate} from '@/utils/prototype/date.js'
import lastPageLine from '@/components/communal/last-page-line';
import {checkImgUrl} from '@/utils/checkImg.js'
export default {
  data() {
    return {
		checkImgUrl,
      title:"我的评价",
      leftIcon:true,
      rightIcon:false,
      page:1,
      rows:10,
      total:0,
      items:[],
      domain:this.$domain,
      lastPageLine:false,
      userImgurl: require("@/static/img/mine/default_header.png"), 

    }
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: this.title
    })
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: '#'+this.baseColor
    // })
  },
  onShow(){
  	// #ifdef H5
  	this.$routers.refreshH5();
  	// #endif
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  mounted() {
    this.commonMounted()
  },

  components:{
    commonHeader,
    lastPageLine
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
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
    commonMounted(){
      http.post(getAllComment,{page:this.page,rows:this.rows}).then(res=>{
        if(res){
          this.items = res.rows;
		 
          this.items.map(v=>{
            
            v.gmtCreate = formatDate(v.gmtCreate)
            v.memberBname = v.memberBname.substring(0,1)+'***'+v.memberBname.substring(v.memberBname.length-1)
            if(v.evaluateGoodsImgs){
              v.evaluateGoodsImgs=v.evaluateGoodsImgs.split(",").filter(item =>{
				  if(item!==''){
					  return item
				  }
			  })
            }
          })
          this.total = res.total;
		  console.log(this.items[3].evaluateGoodsImgs,'img')
        }
      })
    },
    loadMore(){
      let num = Math.ceil(this.total/10);
      this.page++;
      if(this.page<= num){
        http.post(getAllComment,{page:this.page,rows:this.rows}).then(res=>{
          let list = res.rows;
          list.map(v=>{
            v.gmtCreate = formatDate(v.gmtCreate)
            v.evaluateGoodsImgs = v.evaluateGoodsImgs.split(',')
          })
          this.items = [...this.items,...list]
        })
      }else{
        this.lastPageLine = true;
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
  .evaluateList{ 
    width: 100%;
    background: @white-color;
	.evaluateList-detail{
		padding: 42rpx 24rpx ;
		.detail-top{
			display: flex;
			.detail-left{
				width: 64rpx;
				img{
				width: 64rpx;
			    height: 64rpx;
				}
			}
			.detail-right{
				flex: 1;
				margin-left: 16rpx;
				display: flex;
				flex-direction: column;
				.detail-username{
					font-size: 24rpx;
					color: #1E1E1E;
				}
				.detail-spec{
					display: flex;
					color: #A5A5A5;
					font-size: 20rpx;
				}
				.detail-spec-left{
					margin-right: 32rpx;
				}
			}
			
		.detail-time{
			
			color: #999999;
			font-size: 18rpx;
		}
		}
	.detail-middle{
		margin-top: 24rpx;
		color: #333333;
		
	}
	.detail-img{
		margin-top: 24rpx;
		width: 100%;
		height: 200rpx;
		display: flex;
		img{
			width: 200rpx;
			height: 200rpx;
			margin-right: 10rpx;
		}
	}
	.reply{
              background: #f6f6f6;
              border-radius: 2rpx;
              position: relative;
              padding: 20rpx;
              p{
                line-height: 40rpx;
                font-size: @middle-title;
                color: @color-666;
              }
              i{
                color: #f6f6f6;
                position: absolute;
                top:-26rpx;
                left: 42rpx;
              }
            }
	}
	
	
	
   
  }
</style>




