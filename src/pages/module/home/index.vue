<template>
	<view class="uni-page-body home-body animation-in">
		<!-- 广告位 -->
		<view class="top-box">
			<!-- 广告 -->
			<image class="top-ad-img" :src="topAdImgUrl" mode="aspectFill"></image>
			<view class="top-ad-bg"></view>
			<view class="top-ad-btn" hover-class="top-ad-btn-hover" hover-start-time="0" hover-stay-time="0" @click.stop="toAd()">
				<image src="/static/commonStatic/image/home/home_to_ad.png" mode="aspectFit"></image>
			</view>

			<!-- #ifdef MP-WEIXIN -->
			<view class="wx-nav">
				<view class="wx-nav-item">
					<uni-icons type="scan" size="28" color="#fff"></uni-icons>
				</view>
				<view class="wx-nav-item" style="width: 75%;">
					<view class="wx-seach-box">
						<text style="margin: auto;">搜索</text>
						<uni-icons style="margin: auto 12px;" type="search" size="28" color="#000"></uni-icons>
					</view>
				</view>
				<view class="wx-nav-item">
					<uni-icons type="chat" size="28" color="#fff"></uni-icons>
				</view>
			</view>
			<!-- #endif -->

			<!-- 顶部应用 -->
			<view class="top-app-box">
				<view class="top-app-list" hover-class="top-ad-btn-hover" hover-start-time="0" hover-stay-time="0" v-for="(item,index) in topAppList"
				 @click="openApp(item)" :key="item.appId">
					<image class="top-app-img" v-if="item.isUrlIcon" :src="item.icon" mode="aspectFit"></image>
					<ali-svg class="app-icon" v-if="!item.isUrlIcon" :svg-id="item.icon.split(' ')[1]" :icon-theme="item.icon.split(' ')[0]"
					 :key="item.icon"></ali-svg>
					<text class="top-app-name uni-ellipsis">{{item.name}}</text>
				</view>
			</view>
		</view>

		<!-- 应用栏 -->
		<view class="app-list">
			<view class="app-item" v-for="(item,index) in homeAppList" :key="item.appId" hover-class="top-ad-btn-hover"
			 hover-start-time="0" hover-stay-time="0">
				<view class="app-info" @click.stop="openApp(item)">
					<image class="app-icon" v-if="item.isUrlIcon" :src="item.icon" mode="aspectFit"></image>
					<ali-svg class="app-icon" v-if="!item.isUrlIcon" :svg-id="item.icon.split(' ')[1]" :icon-theme="item.icon.split(' ')[0]"
					 :key="item.icon"></ali-svg>
					<text class="app-name uni-ellipsis">{{item.name}}</text>
				</view>
			</view>
			<view class="app-item" hover-class="top-ad-btn-hover" hover-start-time="0" hover-stay-time="0">
				<view class="app-info" @click.stop="toStore()">
					<ali-svg class="app-icon" svg-id="icon-QRcode_flat" icon-theme="pingMianColor"></ali-svg>
					<text class="app-name uni-ellipsis">全部</text>
				</view>
			</view>
		</view>

		<!-- 滚动通知 -->
		<notice-swiper-cmp :list="noticeSwiperList"></notice-swiper-cmp>

		<!-- swiper -->
		<view class="ad-swiper-box">
			<swiper style="height: 100%;" :autoplay="true" :circular="true" previous-margin="10px" next-margin="20px">
				<swiper-item class="ad-swiper-item" v-for="(item,index) in bannerList" :key="index">
					<view class="ad-swiper-img" :style="{'background-image': 'url('+item.imgBase64+')'}" @click="bannerClick(item)">
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 卡片 -->
		<card-cmp v-for="(item,index) in cardList" :key="index" :title="item.mainTitle" :other="item.childTitle" @didClick="cardClick(item)"
		 class="home-card">
			<component :is="item.cmpType" :card-info="item"></component>
		</card-cmp>

		<!-- 抽屉 -->
		<uni-drawer :visible="isShowDrawer" mode="right" @close="closeDrawer()">
			<view class="home-drawer">
				<uni-list class="uni-list">
					<uni-list-item title="Item1" />
					<uni-list-item title="Item2" />
					<uni-list-item title="Item3" />
				</uni-list>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	/* 函数 */
	import scan from "../../../common/js/scan.js";
	import commonUtil from "../../../common/js/commonUtil.js";

	/* 组件 */
	import noticeSwiperCmp from '../../component/noticeSwiperCmp/index.vue';
	import cardCmp from '../../component/cardCmp/index.vue';

	/* 卡片内动态组件 */
	import scrollCardCmp from '../../component/scrollCardCmp/index.vue';
	import imgTextXCardCmp from '../../component/imgTextXCardCmp/index.vue';
	import imgTextYCardCmp from '../../component/imgTextYCardCmp/index.vue';
	import htmlCardCmp from '../../component/htmlCardCmp/index.vue';

	export default {
		name: "home",
		components: {
			noticeSwiperCmp,
			cardCmp,
			scrollCardCmp,
			imgTextXCardCmp,
			imgTextYCardCmp,
			htmlCardCmp
		},

		data() {
			return {

				MAIN_CONFIG: MAIN_CONFIG,

				/* app端控制状态栏颜色用 */
				scorllTopNum: 0,
				onceSet: true,
				onceSetDown: false,

				/* 顶部广告卡地址 */
				topAdImgUrl: uni.getStorageSync("adImgInfo").url,

				/* 抽屉状态 */
				isShowDrawer: false,

				/* 滚动消息list */
				noticeSwiperList: [{
						tagText: "新闻",
						cont: "1111111",
						tagBgColor: "primary",
						active: function(data) {
							console.log(data)
						}
					},
					{
						tagText: "通知",
						cont: "22222",
						tagBgColor: "success",
						active: function(data) {
							console.log(data)
						}
					}
				],

				/* 卡片list */
				cardList: [],

				/* 顶部固定应用 */
				topAppList: uni.getStorageSync("topAppList"),

				/* 我的首页应用 */
				homeAppList: [],

				/* 首页bannerList */
				bannerList: []
			};
		},

		onLoad() {
			uni.showNavigationBarLoading();
			this.bannerFilter();
			this.getCardList();
		},

		onShow() {

			/* 首页show时更新个人应用列表 */
			this.getMyHomeApp();

			//#ifdef APP-PLUS
			/* 状态栏颜色处理 */
			if (this.scorllTopNum > uni.getSystemInfoSync().statusBarHeight) {
				setTimeout(() => {
					uni.setNavigationBarColor({
						frontColor: '#000000',
						backgroundColor: "#FFFFFF"
					})
				})
			} else {
				setTimeout(() => {
					uni.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: "#FFFFFF"
					})
				})
			}
			//#endif
		},

		onReady() {
			uni.hideNavigationBarLoading();
		},

		methods: {

			showDrawer() {
				this.isShowDrawer = true;
			},

			closeDrawer() {
				this.isShowDrawer = false
			},

			/* 去广告链接 */
			toAd() {
				let adImgInfo = uni.getStorageSync("adImgInfo");
				if (adImgInfo.link) {
					this.$routeX.push({
						name: adImgInfo.name,
						url: "/pages/module/webViewApp/index",
						params: {
							visitUrl: adImgInfo.link
						}
					})
				}
			},

			/* banner处理 */
			bannerFilter() {
				uni.getStorage({
					key: "homeBannerList",
					success: (res) => {
						let nowTime = new Date().getTime();
						if (res.data.time > nowTime) {
							this.bannerList = res.data.list || [];
						} else {
							this.getBannerList();
						}
					},
					fail: () => {
						this.getBannerList();
					}
				})
			},

			/* 获取banner */
			getBannerList() {
				let nowTime = new Date().getTime();
				this.$store.dispatch('home/getBannerList', {
						that: this
					})
					.then((list) => {
						let val = {};
						val.list = list;
						val.time = (60 * 60 * 1000 * 24) + nowTime;
						uni.setStorageSync("homeBannerList", val);
						this.bannerList = list || [];
					})
			},

			/* banner点击 */
			bannerClick(item) {
				console.log(item)
				if (item.imgLink) {
					this.$routeX.push({
						name: JSON.parse(item.imgLink).name,
						url: "/pages/module/webViewApp/index",
						params: {
							visitUrl: JSON.parse(item.imgLink).path
						}
					})
				}
			},

			/* 获取我的首页应用 */
			getMyHomeApp() {

				let homePageAppList = [{
						"appId": 10419,
						"seq": 1
					},
					{
						"appId": 10436,
						"seq": 2
					},
					{
						"appId": 85,
						"seq": 3
					}
				];

				this.homeAppList = [];
				homePageAppList.sort(function(a, b) {
					return a.seq - b.seq;
				})
				homePageAppList.forEach(item => {
					let info = uni.getStorageSync("allAppList").find(i => {
						return i.appId == item.appId;
					})
					if (info) {
						this.homeAppList.push(info)
					}
				});
				uni.setStorageSync("myAppList", this.homeAppList);

			},

			/* 卡片右侧点击 */
			cardClick(data) {
				switch (Number(data.linkType)) {
					case 1:
						this.$openApp(data.linkAppid);
						break;
					case 2:
						this.$routeX.push({
							name: data.mainTitle,
							url: "/pages/module/webViewApp/index",
							params: {
								visitUrl: data.linkUrl
							}
						});
						break;
				}
			},

			/* 获取卡片列表 */
			getCardList() {

				let data = [{
						"id": 3,
						"cmpType": "imgTextXCardCmp",
						"mainTitle": "超值团购",
						"childTitle": "520告白季",
						"linkAppid": 0,
						"linkType": "2",
						"linkUrl": "https://www.baidu.com",
						"contList": "[{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"enzo珠宝情人节礼物小宇宙18K金月亮星星Akoya海水珍珠蓝宝石耳饰\",\"childTitle\":\"优雅个性 Akoya海水珍珠耳钉\",\"tip\":\"十二期免息\",\"url\":\"https://www.baidu.com\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"OSEWAYA日本Piearth首饰盒公主皇冠欧式饰品求婚戒指盒珠宝收纳盒\",\"childTitle\":\"产品有礼品袋，如需要请留言，不留言不送\",\"tip\":\"¥ 1556.00-1848.00\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"周六福黄金戒指女素金足金珠宝计价心型首饰指环活口戒指送礼\",\"childTitle\":\"闪耀车花工艺，凸显黄金质感，气质优雅。\",\"tip\":\"满1500减150\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"Diesel迪赛手表男\",\"childTitle\":\"黄景瑜同款时尚偏光大表盘男表正品DZ7395\",\"tip\":\"全国联保\",\"url\":\"\"}]",
						"bindAppid": 1
					},
					{
						"id": 4,
						"cmpType": "imgTextYCardCmp",
						"mainTitle": "精品网课",
						"childTitle": "系统化学习路径",
						"linkAppid": 0,
						"linkType": "2",
						"linkUrl": "https://www.baidu.com",
						"contList": "[{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"全新Unity-VIP全套系列\",\"childTitle\":\"游戏开发工程师的必修课\",\"tip\":\"\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"FFmpeg安卓流媒体播放器开发实\",\"childTitle\":\"实战性很强的应用编程\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"uni-app实战仿小米商城app开发\",\"childTitle\":\"原生开发、提高性能、完整商城项目\",\"tip\":\"\",\"url\":\"\"}]",
						"bindAppid": 1
					},
					{
						"id": 8,
						"cmpType": "htmlCardCmp",
						"mainTitle": "疫情动态",
						"childTitle": "关注全球疫情",
						"linkAppid": "",
						"linkType": "2",
						"linkUrl": "https://voice.baidu.com/act/newpneumonia/newpneumonia/?from=osari_pc_1",
						"contList": "<table width=\"828\" style=\"width: 359px;margin:auto;\" align=\"center\">     <tbody>         <tr class=\"firstRow\">             <td valign=\"top\" width=\"275\" style=\"border-style: solid; border-color: rgb(255, 255, 255);\" align=\"center\">                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: inherit, serif; color: rgb(112, 173, 71);\">0</span>                 </p>                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: 微软雅黑, sans-serif;\">四川新增</span>                 </p>             </td>             <td valign=\"top\" width=\"276\" style=\"border-style: solid; border-color: rgb(255, 255, 255);\" align=\"center\">                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: inherit, serif; color: rgb(68, 114, 196);\">1</span>                 </p>                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: 微软雅黑, sans-serif;\">国内新增</span>                 </p>             </td>             <td valign=\"top\" width=\"276\" style=\"border-style: solid; border-color: rgb(255, 255, 255);\" align=\"center\">                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: inherit, serif; color: rgb(237, 125, 49);\">99415</span>                 </p>                 <p style=\"text-align: center;\">                     <span style=\"font-size: 12px; font-family: 微软雅黑, sans-serif;\">国外新增</span>                 </p>             </td>         </tr>     </tbody> </table>",
						"bindAppid": 1
					},
					{
						"id": 9,
						"cmpType": "scrollCardCmp",
						"mainTitle": "热门活动",
						"childTitle": "CSDN活动-开发者活动大本营",
						"linkAppid": 0,
						"linkType": "2",
						"linkUrl": "https://huiyi.csdn.net/",
						"contList": "[{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"\",\"childTitle\":\"\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"\",\"childTitle\":\"\",\"url\":\"\"},{\"imgUrl\":\"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png\",\"mainTitle\":\"\",\"childTitle\":\"\",\"url\":\"\"}]",
						"bindAppid": 1
					}
				]
				let arr = [];
				data.forEach((item) => {
					if (item.bindAppid == 1) {
						arr.push(item);
					};
				});
				this.cardList = arr;

			},

			/* 打开应用 */
			openApp(appInfo) {
				this.$openApp(appInfo.appId)
			},

			toStore() {
				this.$routeX.push({
					name: "应用中心",
					url: "/pages/module/appStore/index"
				})
			}
		},

		/* 搜索框点击 */
		onNavigationBarSearchInputClicked(e) {
			if (this.isShowDrawer) {
				this.closeDrawer()
				return true
			}

			uni.showModal({
				title: '提示',
				content: '用户点击搜索',
				success: res => {}
			});
		},

		/* 导航栏按钮点击 */
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0: //抽屉点击
					this.isShowDrawer = !this.isShowDrawer
					break;
				case 1: //扫码点击
					if (this.isShowDrawer) {
						this.closeDrawer()
						return true
					}
					scan.methods.scan((data) => {
						console.log(data)
					})
					break;
			}
		},

		//#ifdef APP-PLUS
		/* 状态栏颜色处理 */
		onPageScroll(e) {
			if (e.scrollTop >= uni.getSystemInfoSync().statusBarHeight && !this.onceSetUp) {
				this.scorllTopNum = e.scrollTop;
				uni.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: "#FFFFFF",
					success: () => {
						this.onceSetUp = true;
						this.onceSetDown = false;
					}
				})
			} else if (e.scrollTop < uni.getSystemInfoSync().statusBarHeight && !this.onceSetDown) {
				this.scorllTopNum = e.scrollTop;
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: "#FFFFFF",
					success: () => {
						this.onceSetUp = false;
						this.onceSetDown = true;
					}
				})
			}
		}
		//#endif
	}
</script>

<style scoped lang="less">
	.home-body {
		background-color: #fff;

		image {
			will-change: transform
		}

		padding-bottom: var(--window-bottom);

		.top-box {
			height: 18em;
			position: relative;
		}

		.top-ad-img {
			width: 100%;
			height: 100%;
			border-bottom-left-radius: 90% 10%;
			border-bottom-right-radius: 90% 10%;
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

		}

		.top-ad-bg {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));

		}

		.top-ad-btn {
			border-radius: 50px;
			position: absolute;
			bottom: calc(0px - 29px / 2);
			left: 50%;
			-webkit-transform: translate(-50%, 0%);
			transform: translate(-50%, 0%);
			background-image: linear-gradient(to right, rgba(70, 158, 206, 0.9), rgba(22, 124, 212, 0.9));
			box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
			line-height: 0;
			padding: 5px 0;

			image {
				height: 1.7em;
				width: 10em;
			}
		}

		.top-ad-btn-hover {
			box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
		}

		.top-ad-btn::after {
			border: none;
		}

		/* #ifdef MP-WEIXIN */
		.wx-nav {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 0 10px;
			position: absolute;
			top: var(--status-bar-height);
			box-sizing: border-box;

		}

		.wx-nav-item {
			line-height: 1.3;
		}

		.wx-seach-box {
			height: 100%;
			line-height: 1.3;
			background: #f8f8f8;
			border-radius: 50px;
			display: flex;
			justify-content: space-between;
		}

		/* #endif */
		.top-app-box {
			position: absolute;
			top: calc(60px + var(--status-bar-height));
			width: 100%;
			display: flex;
			justify-content: space-around;

			.top-app-list {
				text-align: center;
				display: flex;
				flex-direction: column;
				border-radius: 5px;
				padding: 0.5em;
				width: 4em;
				color: #fff;
				justify-content: flex-end;
			}

			.top-app-img {
				width: 2.5em;
				height: 2.5em;
				margin: auto;
			}

			.top-app-icon {
				font-size: 24px;
				text-shadow: 0 0 2px #fff;
			}

			.top-app-name {
				font-size: 12px;
			}

		}

		.app-list {
			width: 100%;
			margin-top: calc(10px + 29px / 2);
			border-bottom-left-radius: 15px;
			border-bottom-right-radius: 15px;
			box-shadow: 0 6px 6px rgba(150, 150, 150, 0.1);
			line-height: 0;
		}

		.app-item {
			width: 20%;
			padding-top: 20%;
			position: relative;
			display: inline-block;
			border-radius: 15px;
		}

		.app-info {
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			text-align: center;
			display: flex;
			flex-flow: column;
			justify-content: flex-end;
		}

		.app-icon {
			width: 2em;
			height: 2em;
			margin: 0 auto;

		}

		.app-name {
			font-size: 12px;
			display: block;
			padding: 0 2px;
			margin: .5em 0;
		}

		.ad-swiper-box {
			height: 80px;
			margin-top: 10px;
		}

		.ad-swiper-item {
			height: 100%;
		}

		.ad-swiper-img {
			height: 100%;
			border-radius: 8px;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
			margin-left: 10px;
		}

		.home-card {
			margin-top: 10px;
			border-top-left-radius: 15px;
			border-top-right-radius: 15px;
			box-shadow: 0 -6px 6px rgba(150, 150, 150, 0.1);
		}

		.home-card-cont {
			padding: 0 10px 10px 10px;
		}

		.home-drawer {
			height: 100%;
			padding-top: calc(44px + var(--status-bar-height));
		}




	}
</style>
