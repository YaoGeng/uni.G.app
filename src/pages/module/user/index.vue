<template>
	<view class="uni-page-body user animation-in">
		<view class="top-box">
			<view class="filter-blur" :style="{'background-image':'url('+userInfo.headImage+')'}"></view>
			<view class="info-box">
				<view class="user-info-box">
					<image class="head-img" :src="userInfo.headImage" mode="aspectFill" @click="updateHeadImg()">
					</image>
					<text class="user-name">{{userInfo.nickName}}</text>
					<view class="setting" @click="toSetting()">
						<ali-svg svg-id="icon-searchsetting_flat" icon-theme="pingMianColor"></ali-svg>
					</view>
				</view>
				<view class="other-info-box">
					<view class="other-info-item" v-for="(item,index) in otherInfoList" :key="index">
						<text class="other-info-title">{{item.title}}</text>
						<text class="other-info-cont">{{item.cont}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="card-box">

			<view class="top-app-box">
				<view class="top-app-list" hover-class="top-app-hover" hover-start-time="0" hover-stay-time="0" v-for="(item,index) in topAppList"
				 @click="openApp(item)" :key="index">
					<image class="top-app-icon" v-if="item.isUrlIcon" :src="item.icon" mode="aspectFit"></image>
					<ali-svg class="top-app-icon" v-if="!item.isUrlIcon" :svg-id="item.icon.split(' ')[1]" :icon-theme="item.icon.split(' ')[0]" :key="item.icon"></ali-svg>
					<text class="top-app-name uni-ellipsis">{{item.name}}</text>
				</view>
			</view>

			<card-cmp v-for="(item,index) in cardList" :key="index" :title="item.mainTitle" :other="item.childTitle" @didClick="cardClick(item)"
			 class="user-card">
				<component v-if="item.cmpTag" :is="item.cmpType" :card-info="item"></component>
			</card-cmp>

		</view>
	</view>
</template>

<script>
	import imageCache from "../../../common/js/imageCache.js";
	import cardCmp from '../../component/cardCmp/index.vue';
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		name: "user",
		components: {
			cardCmp
		},
		data() {
			return {
				
				userInfo: uni.getStorageSync("loginInfo").userBaseInfo,
				otherInfoList: [{
						title: "今日会议",
						cont: "1",
						appId: "0"
					},
					{
						title: "今日消费",
						cont: "8",
						appId: "0"
					},
					{
						title: "今日课程",
						cont: "3",
						appId: "0"
					}
				],

				topAppList: uni.getStorageSync("topAppList"),
				
				cardList: []
			}
		},
		
		onLoad() {
			uni.showNavigationBarLoading();
		},
		onReady() {
			uni.hideNavigationBarLoading();
		},
		
		methods: {
			openApp(appInfo) {
				this.$openApp(appInfo.appId)
			},
			
			/* 选择头像上传 */
			updateHeadImg() {
				let that = this;
				let arr = [];
				if(this.userInfo.headImage){
					arr = ["修改头像","查看大图"];
				}else{
					arr = ["上传头像"]
				}
				//展开菜单
				uni.showActionSheet({
				    itemList: arr,
				    success: function (res) {
						switch (res.tapIndex){
							case 0:
								/* 选择图片方法 */
								uni.chooseImage({
									count: 1,
									sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
									success: function(res) {
										
										/* 转base64 */
										imageCache.fileImgToBase64(res.tempFilePaths,(data)=>{
											that.undataBase64(data[0]);
										})
										
									}
								})
							break;
							case 1:
								uni.previewImage({
									urls: [that.userInfo.headImage]
								});
							break;
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			
			/* 上传base64转url */
			undataBase64(base64){
				uni.showNavigationBarLoading();
				
				/* 上传操作。。。 */
				
				this.restUserInfo()
			},
			
			/* 重拉用户信息 */
			restUserInfo(){
				let that = this;
				
				uni.showToast({
					title: "已更新",
					icon: "none",
					position: 'bottom'
				})
				// imageCache.netImgToBase64(headImage)
				// .then((res)=>{
				// 	that.userInfo.headImage = res;
				// 	data.userBaseInfo.headImage = res;
				// 	uni.setStorageSync("loginInfo", data);
				// })
				uni.hideNavigationBarLoading();
			},
			
			/* 卡片右侧点击 */
			cardClick(data) {
				switch (Number(data.linkType)) {
					case 1:
						this.$openApp(data.linkAppid);
						break;
					case 2:
						this.$routeLink.push({
							name: data.mainTitle,
							url: "/pages/module/webViewApp/index",
							params: {
								visitUrl: data.linkUrl
							}
						});
						break;
				}
			},
			
			/* 跳转设置 */
			toSetting(){
				console.log(11)
				this.$routeLink.push({
					name: "设置",
					url: "/pages/module/setting/index"
				});
			}
		},
		
		onHide() {
			uni.stopPullDownRefresh();
		},
		
		onPullDownRefresh() {
			this.restUserInfo()
			uni.stopPullDownRefresh();
			//#ifdef APP-PLUS
			uni.vibrateShort();
			//#endif
		}
	}
</script>

<style scoped lang="less">
	.user {

		.top-box {
			height: 15em;
			position: relative;
			overflow: hidden;

			.info-box {
				position: absolute;
				top: calc(10% + var(--status-bar-height));
				left: 0%;
				width: 100%;
			}

			.user-info-box {
				margin-left: 10%;
				display: flex;
				position: relative;
			}
			
			.setting{
				position: absolute;
				top: 50%;
				right: 10%;
				transform: translate(0%, -50%);
			}

			.head-img {
				width: 4em;
				height: 4em;
				border-radius: 50%;
				border: 3px solid #fff;
			}

			.user-name {
				position: absolute;
				top: 50%;
				left: 4em;
				transform: translate(0%, -50%);
				font-size: 18px;
				font-weight: bold;
			}

			.other-info-box {
				margin-top: 10px;
				display: flex;
				justify-content: space-around;
			}

			.other-info-item {
				text-align: center;
				display: flex;
				flex-direction: column;
			}

			.other-info-title {
				font-size: 10px;
				color: #4e4e4e;
			}

			.other-info-cont {
				font-size: 20px;
			}
		}

		.card-box {}

		.top-app-box {
			position: relative;
			border-radius: 10px;
			top: -1.5em;
			left: 50%;
			-webkit-transform: translate(-50%, 0%);
			transform: translate(-50%, 0%);
			height: 6em;
			width: 92%;
			background: #fff;
			box-shadow: 0 0px 6px rgba(0, 0, 0, 0.1);
			display: flex;
			justify-content: space-around;
		}

		.top-app-list {
			text-align: center;
			display: flex;
			flex-direction: column;
			border-radius: 5px;
			padding: 0.5em;
			width: 4em;
		}

		.top-app-icon {
			width: 2.5em;
			height: 2.5em;
			margin: auto;
		}

		.top-app-name {
			font-size: 12px;
		}

		.top-app-hover {
			box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
		}

		.user-card {
			background-color: #fff;
			width: 100%;
			border-bottom: 0.5px solid #f8f8f8;
			/deep/.title{
				font-weight: normal;
			}
		}
	}
</style>
