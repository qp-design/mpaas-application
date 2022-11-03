<template>
	<div class="find">
		<div class="header">
			<div class="nav">
				<span @click="changeNav(index,item)" v-for="(item,index) in navList" :key="index" :class="index==navIndex?'nowNav':''">{{item.conttitleNameNow}}</span>
			</div>
		</div>
		<div class="main">
			<div class="blue"></div>
			<div class="articles">
				<div class="article" :key="index" v-for="(item,index) in articleList" @click="goDetail(item)">
					<div class="title">{{item.contlistNameNow}}</div>
					<img :src="checkImgUrl(item.contlistPicurlNow)" alt="">
					<div class="content">{{item.contlistOpcode}}</div>
				</div>
				<div class="noMore" v-if="showNoMore">暂无更多</div>
			</div>
		</div>
		<vueTabBar :selectNavIndex="selectNavIndex" :baseColor="baseColor" :footerMenu="footerMenu" />
		<!-- <showLogin></showLogin> -->
	</div>
</template>

<script>
import http from '@/api/http.js';
import vueTabBar from '@/components/communal/vueTabBar';
import { $storage, $routers } from '@/utils/prototype/vue.js';
import { getIndexInfo,getIndexDetail } from '@/api/interface.js';
// import showLogin from '@/components/communal/showLogin';
	import {
		checkImgUrl
	} from '@/utils/checkImg.js'
export default{
	data(){
		return {
			checkImgUrl,
			baseColor: '',
			selectNavIndex: 2,
			footerMenu: [],
			navList:[],
			navIndex:0,
			rows: 10,
			page: 1,
			articleList:[],
			img:this.$imgDomain,
			showNoMore:false,
			showAfterLogin:false
		}
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: "发现"
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		wx.hideHomeButton()
		// uni.hideHomeButton()
		if(this.articleList.length==0&&this.showAfterLogin==true){
			this.getArticleList(this.navList.length>0&&this.navList[0].conttitleCode)
		}
	},
	components: { vueTabBar },
	beforeCreate() {
		http.get(getIndexInfo,{tginfoMenuCode:'findo2o'}).then((res)=>{
			for(let i=0;i<res.length;i++){
				if(res[i].dataState==2){
					this.navList=this.navList.concat(res[i])
				}
			}
			this.showAfterLogin=true
			this.getArticleList(this.navList[0].conttitleCode)
		})
	},
	mounted() {
		this.footerMenu = $storage.get('footerMenu');
	},
	onReachBottom() {
		if(this.showNoMore==false){
			this.page=this.page+1
			http.post(getIndexDetail,{
				order:"desc",
				rows: this.rows,
				page: this.page,
				conttitleCode:this.navList[this.navIndex].conttitleCode,
				conttitleType: 'doc'
			}).then((res)=>{
				this.articleList=this.articleList.concat(res.list)
				if(this.articleList.length<=res.total){
					this.showNoMore=true
				}
			})
		}
	},
	methods:{
		changeNav(index,item){
			if(this.navIndex==index){
				return
			}
			this.navIndex=index
			this.getArticleList(item.conttitleCode)
		},
		goDetail(item){
			this.$routers.push('find/articleDetail',{doclistId:item.contlistPicurl3Now})
		},
		getArticleList(conttitleCode){
			http.post(getIndexDetail,{
				order:"desc",
				rows: this.rows,
				page: this.page,
				conttitleCode:conttitleCode,
				conttitleType: 'doc'
			}).then((res)=>{
				this.showNoMore=false
				this.articleList=[res.list[0]]
				setTimeout(()=>{
					this.articleList=res.list
					if(this.articleList.length<=res.total){
						this.showNoMore=true
					}
				},50)
			})
		}
	}
}
</script>

<style lang="less" scoped>
.find{
	.header{
		z-index: 999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 87rpx;
		width: 100%;
		background-color: #0084c9;
		overflow: ;
		.nav{
			box-sizing: content-box;
			padding: 28rpx 25rpx 28rpx 25rpx;
			width: 100%;
			height: 31rpx;
			overflow-x: scroll;
			white-space: nowrap;
			color: #fff;
			font-size: 25rpx;
			line-height: 31rpx;
			background-color: #0084c9;
			span{
				margin-right: 46rpx;
			}
			.nowNav{
				position: relative;
				font-weight: 600;
			}
			.nowNav::after{
				position: absolute;
				bottom: -7rpx;
				left: 50%;
				transform: translateX(-50%);
				content: '';
				display: inline-block;
				width: 22rpx;
				height: 5rpx;
				border-radius: 2.5rpx;
				background-color: #fff;
			}
		}
		.nav::-webkit-scrollbar{
		    display:none;
		}
	}
	.main{
		box-sizing: border-box;
		padding-top: 84rpx;
		width: 100%;
		background-color: #f3f3f3;
		min-height: 100vh;
		.blue{
			width: 100%;
			height: 197rpx;
			background-color: #0084c9;
		}
		.articles{
			padding-bottom: 160rpx;
			width: 700rpx;
			margin: 0 auto;
			.article{
				background-color: #fff;
				height: 538rpx;
				width: 100%;
				overflow: hidden;
				padding: 32rpx 32rpx 42rpx 32rpx;
				margin-bottom: 24rpx;
				border-radius: 15rpx;
				.title{
					height: 68rpx;
					width: 100%;
					font-size: 28rpx;
					font-weight: 600;
					overflow: hidden;
				}
				img{
					width: 635rpx;
					height: 325rpx;
					margin-bottom: 20rpx;
				}
				.content{
					display: -webkit-box;
					width: 100%;
					font-size: 25rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					color: #656565;
				}
			}
			.article:first-child{
				margin-top: -197rpx;
			}
			.noMore{
				height: 40rpx;
				width: 100%;
				color: #333;
				text-align: center;
			}
		}
	}
}
</style>
