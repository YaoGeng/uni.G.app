<template>
	<view class="detail-box">
		<view class='app-box'>
			<view class="icon-box">
				<ali-svg class="appIcon" :svg-id="appInfo.appIconUrl.split(' ')[1]" :icon-theme="appInfo.appIconUrl.split(' ')[0]"></ali-svg>
			</view>
			<view class="name-box">
				<text class="name">{{appInfo.appName}}</text>
				<text class="type">{{appInfo.appMenuName}}</text>
			</view>
			<view class="detail-box">
				<text class="detail" @click="toDetail()">立即申请</text>
			</view>
		</view>
		<scroll-view class="app-img-box" :scroll-x="true" style="white-space: nowrap; display: flex;">
			<image class="app-img" :src="item" mode="aspectFill" v-for="(item,index) in imgList" :key="index" @click="bigImg(index)"></image>
		</scroll-view>
		<jyf-parser class="detail-html" :html="content"></jyf-parser>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appInfo: {},
				content: "",
				imgList: []
			}
		},
		onLoad() {
			this.appInfo = this.$parseURL();
			this.content = this.appInfo.appInfo;
			this.imgList = JSON.parse(this.appInfo.appPicUrl);
		},
		methods: {
			toDetail() {
				this.$routeX.push({
					name: "申请应用",
					url: "/pages/module/webViewApp/index",
					params: {
						visitUrl: "https://www.app8848.com/web/#/app/136002056?token=688311360_eNJjiXJTn2hQk2OJm9I6MTM209JbaXmpc2lQkblbIjoO09JlkWFpk9I6IdIsIZmNk2LdxjAsIZlRmZCJm9I6M9PdaXyDk2GZaXJSIjoO09Jsk2ipklupkWrdxj7KxDbNyDcLMjAKMTIsIZKhaZCNaWvdxdId09JSmWGKtWvdxj7KyzrsIZGpn2SxnWKlIjodGp2oGV90IdPdc5hQkZrdxdId09JPaWvdxdIOMT7OMT7OMT7OMT7OMT7d09JNmWFsTZFSmtI6IRaiVxagdNIsIYJQk5rdxjvsIYyja5CQk7GhkWrdxd0lhkDpgJTlp1flUand09JzmWyKcZlLeqBhc3y3k3JbIjodMjrGyTbHxThfazuue4pjebK6nzcd09Jza5CNi7GhkWrdxdJMqFhmIdPdi4mqc2qNtWvdxjAsIYqRaXvdxdJRiWOsIdPdiXylcblbIjoOMznHxTcsIYqzmXJxnWKlIjodeWFRm2uQkZcd09J3e4qzmXJpm9I6IYlhkZibk2GYIYL"
					}
				})
			},
			bigImg(index) {
				uni.previewImage({
					current:index,
					indicator:"number",
					urls: this.imgList,
					longPressActions: {
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.detail-box {
		background: #fff;


		.app-box {
			display: flex;
			padding: 12px 0;
			margin: 0 20px;
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
				padding: 4px 22px;
				background: <!-- @echo ui.themeColor -->;
				border-radius: 50px;
				color: #fff;
			}
		}

		.app-img-box {
			box-sizing: border-box;
			padding: 20px 20px 20px 20px;

			.app-img {
				display: inline-block;
				height: calc(667px * 0.6);
				width: calc(375px * 0.6);
				margin-right: 20px;
				border-radius: 12px;
			}

			.app-img:last-child {
				margin-right: 0px;
			}
		}

		.detail-html {
			padding: 0 20px 20px;
		}
	}
</style>
