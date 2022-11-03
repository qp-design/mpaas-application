<template>
    <div class="userinfo" v-show="showModel">
      <div class="userinfo-title">
        <div class="userinfo-title-sq">{{shopMessage}} 申请</div>
        <p class="userinfo-title-get">获取你的昵称、头像、地区及性别</p>
        <div class="userinfo-title-img">
          <img :src="msg.avatarUrl"/>
          <div class="">
            <h3>{{msg.nickName}}</h3>
            <h5>微信个人信息</h5>
          </div>
        </div>
        <div class="userinfo-title-btn">
          <button @click="cancelUserInfo">取消</button>
          <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo">允许</button>
        </div>
      </div>
    </div>
</template>

<script>
import {$storage} from '@/utils/prototype/vue.js'
import {loginMiniProgram} from '@/api/interface.js'
import http from '@/api/http.js'
export default {
    props:['shopMessage'],
    data(){
        return {
            showModel:false,
            msg:{},
            appid:'',
            secret:'',
            state:'wx',
            grant_type:'',
            domains:this.$domain,
            userImgurl: require("../../static/img/mine/default_header.png"), //头像
        }
    },
    mounted() {
        console.log(this.showModel,'showModel');
        let that = this;
        wx.getSetting({
            success: function(res){
                if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function(res) {
                            $storage.set('userInfo', res.userInfo);
                            that.$emit('toShow',false);
                        }
                    })
                }
            }
        })
    },
    methods: {
        bindGetUserInfo: function(e) {
            console.log(e.detail.userInfo,'userinfo')
            if(e.detail.userInfo){
                wx.login({
                    success(res) {
                        if (res.code) {
                            $storage.set('code',res.code)
                            http.get(loginMiniProgram,{js_code:res.code,state:'wx'}).then(res=>{
                                let ticketTokenid = JSON.parse(res.dataObj.userInfo)
                                $storage.set('sessionid',ticketTokenid.ticketTokenid)
                                
                            })
                        } else {
                            console.log('登录失败！' + res.errMsg)
                        }
                    }
                })
            }else{
                console.log('用户按了取消授权')
            }
        },
        cancelUserInfo(){
            
            this.$emit('toShow',{current:'1',to:false})
        }
    },
    
}
</script>

<style lang="less">
@import '../../common/css/common.less';
.userinfo{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    z-index: 99999;
    &-title{
        background: @white-color;
        padding: 0 30rpx;
        position: absolute;
        width: calc(100% - 60rpx);
        bottom: 0;
        left: 0;
        &-sq{
            font-size: @top-title;
            padding:@padding-tb;
        }
        &-get{
            padding-bottom:40rpx;
            
            font-size: 36rpx;
        }
        &-img{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding:15rpx 0;
            border-top:1rpx solid #f5f5f5;
            border-bottom:1rpx solid #f5f5f5;
            font-size: @middle-title;
            img{
                width: 75rpx;
                height: 75rpx;
                border-radius: 5rpx;
                margin-right:10rpx;
            }
            h3{
                color:@color-333;
                margin-bottom:5rpx;
            }
            h5{
                color:@color-999;
            }
        }
        &-btn{
            display: flex;
            padding:70rpx 0;
            button{
                flex:1;
                color:@color-333;
                text-align: center;
                height: 70rpx;
                line-height: 70rpx;
                font-size: @middle-title;
                &:nth-child(1){
                    margin-right:20rpx;
                    background: @color-999;
                }
                &:last-child{
                    background:@main-color;
                    color:@white-color;
                }
            }
        }
    }
}
</style>

