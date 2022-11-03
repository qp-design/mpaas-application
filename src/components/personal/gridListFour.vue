<template>
	<div class="grid-container">
		<div class="grid-list" v-if="num" v-for="(itemBox, indexBox) in num" :key="indexBox">
			<div
				class="grid-item"
				v-for="(item, index) in gridList"
				v-if="indexBox * 4 <= index && index < (indexBox + 1) * 4"
				:key="index"
				@click="routerLink(item)"
			>
				<div :class="'iconfont ' + item.menuDefaultClass" v-bind:style="{color: item.proappMenuIcon ? item.proappMenuIcon : baseColor}"></div>
				<p class="menu-name">{{ item.menuName }}</p>
			</div>

			<div v-if="indexBox + 1 == num.length && (gridList.length - 1) % 4 == 0" v-for="(itemN, indexN) in arrThree" :key="indexN" class="grid-item"></div>
			<div v-if="indexBox + 1 == num.length && (gridList.length - 1) % 4 == 1" v-for="(itemN, indexN) in arrTwo" :key="indexN" class="grid-item"></div>
			<div v-if="indexBox + 1 == num.length && (gridList.length - 1) % 4 == 2" v-for="(itemN, indexN) in arrOne" :key="indexN" class="grid-item"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'grid-list-four',
	props: {
		gridListCon: {
			type: Object,
			default: null
		},
		baseColor: {
			type: String,
			default: '#333333'
		}
	},
	data() {
		return {
			num: null,
			gridMenu: this.gridListCon,
			gridList: [],
			arrOne: new Array(1),
			arrTwo: new Array(2),
			arrThree: new Array(3)
		};
	},
	mounted() {
		this.gridMenu.children.forEach(el => {
			if (el.menuShow == 0) {
				this.gridList.push(el);
			}
		});
		console.log(this.gridList, this.gridMenu)

		// this.num = this.gridList ? Math.ceil(this.gridList.length / 4) : false;
		this.num = new Array(this.gridList ? Math.ceil(this.gridList.length / 4) : false);
		console.log(new Array(this.num))
	},
	methods: {
		routerLink(item){
			this.$state.set('currentRouter', item);
			this.$routers.push(item.menuJspath)
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.grid-container {
	background-color: @white-color;
	border-radius: 10rpx;
	margin: 20rpx;
	.grid-list {
		display: flex;
		.grid-item {
			width: 0;
			flex: 1;
			padding: 30rpx 0;
			text-align: center;

			.menu-name {
				font-size: 26rpx;
				color: #666666;
			}
		}
	}
}
</style>
