<template>
	<view class="p-flex-box app-store">

		<!-- 分类导航 -->
		<view class="p-flex-box__flexd tab-nav-box">
			<top-scroll-nav-cmp class="top-nav" :active-index="tabIndex" :tab-data="typeList" title-key="appMenuName" @tabClick="changeTab">
			</top-scroll-nav-cmp>
		</view>

		<!-- 分类应用 -->
		<view class="p-flex-box__auto-scrolly tab-body-box">
			<image class="animation-in" style="width: 100%;padding: 10px;box-sizing: border-box;" :src="imgUrl" mode="aspectFit"></image>
			<card-cmp :title="cardTitle">
				<view :class="[
								'app-box',
								tabAnima==2?'animation-left':(tabAnima==3?'animation-right':'animation-in')
							]"
					v-for="item in appList" :key="item.appId">
					<view class="icon-box">
						<ali-svg class="appIcon" :svg-id="item.appIconUrl.split(' ')[1]" :icon-theme="item.appIconUrl.split(' ')[0]"></ali-svg>
					</view>
					<view class="name-box">
						<text class="name">{{item.appName}}</text>
						<text class="type">{{item.appMenuName}}</text>
					</view>
					<view class="detail-box">
						<text class="detail" @click="toDetail(item)">详情</text>
					</view>
				</view>
				<!-- 上拉加载UI组件 -->
				<uni-load-more class="animation-in" :status="paginationStatus.hasMore" :size="16" :content-text="paginationStatus.contentText" />
			</card-cmp>


		</view>

	</view>
</template>

<script>
	import topScrollNavCmp from "../../component/topScrollNavCmp/index.vue";
	import cardCmp from '../../component/cardCmp/index.vue';
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		components: {

			topScrollNavCmp,
			cardCmp
		},
		data() {
			return {

				MAIN_CONFIG: MAIN_CONFIG,

				/* 加载状态 */
				paginationStatus: {
					hasMore: "loading", //加载组件状态
					contentText: {
						contentdown: '上拉(๑＞ڡ＜)☆',
						contentrefresh: '加载中(..•˘_˘•..)',
						contentnomore: '没有咯(๑•́ ₃•̀๑)'
					}
				},

				//分类
				typeList: [{
						appMenuName: "推荐",
						menuId: "0",
						picUrl: "/static/aliasStatic/image/ltAppStore/banner.png"
					}],
				tabIndex: 0, //分类初始下标
				tabAnima: 1, //分类切换样式 1in  2left  3right

				cardTitle: "",
				
				imgUrl: "",
				
				appList: []
			};
		},

		onLoad() {
			this.$http({
				url:MAIN_CONFIG.serverUrl.httpInterface+"app/getAppMenuList.htm"
			}).then((res)=>{
			
				this.typeList.push(...res.list);
				this.getRecommend();
			})
			this.cardTitle = this.typeList[0].appMenuName
			this.imgUrl = this.typeList[0].picUrl
		},

		methods: {


			getRecommend(){
				this.paginationStatus.hasMore = "loading";
				this.$http({
					url:MAIN_CONFIG.serverUrl.httpInterface+"app/getRecommendAppList.htm"
				}).then((res)=>{
					let list = [];
					res.list.forEach((item)=>{
						if(item.status == 1){
							list.push(item);
						} 
					})
					this.appList = list;
				})
				.finally(()=>{
					this.paginationStatus.hasMore = "noMore";
				})
			},


			/* 应用分类切换 */
			changeTab(item, index) {
				this.appList = [];
				//动画处理
				if (index > this.tabIndex) {
					this.tabAnima = 2;
				} else if (index < this.tabIndex) {
					this.tabAnima = 3;
				} else {
					this.tabAnima = 1;
				}

				this.tabIndex = index;

				this.cardTitle = item.appMenuName;
				
				this.imgUrl = item.picUrl;
				
				if(this.tabIndex != 0){
					this.paginationStatus.hasMore = "loading";
					this.$http({
						url:MAIN_CONFIG.serverUrl.httpInterface+"app/getAppListByMenuId.htm",
						data:{
							appType:item.menuId
						}
					}).then((res)=>{
						this.appList = res.list;
					})
					.finally(()=>{
						this.paginationStatus.hasMore = "noMore";
					})
				}else{
					this.getRecommend();
				}
				
			},
			
			toDetail(item){
				this.$routeX.push({
					name:"",
					url:"/pages/module/ltAppStore/detail",
					params:item
				})
			}

		}

	}
</script>

<style lang="less" scoped>
	.app-store {
		height: 100%;
		background: #fff;

		/deep/ .tab-box {
			box-shadow: none;
		}

		.app-box {
			display: flex;
			padding: 12px 0;
			margin: 0 20px;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.icon-box {
			padding: 10px;
			border: 1rpx solid #f0f0f0;
			border-radius: 5px;
		}

		.appIcon {
			height: 3.3em;
			width: 3.3em;
		}

		.name-box {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			padding-left: 20px;

			.name {
				font-size: 16px;
				font-weight: bold;
			}

			.type {
				color: #c5c5c5;
			}
		}

		.detail-box {
			flex: 1;
			height: auto;
			position: relative;

			.detail {
				position: absolute;
				top: 50%;
				right: 0;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(0%, -50%);
				padding: 4px 30px;
				background: #f3f3f3;
				border-radius: 50px;
				color: <!-- @echo ui.themeColor -->;
			}
		}
	}
</style>
