<template>
	<view style="height: 100%;">
		<!-- 坑 涉及base64渲染的全用image或者img -->
		<image class="uni-page-body ad" :src="imgInfo.url" mode="aspectFill" @click="toLink()">
		</image>
		<button size="mini" class="jumpBtn" @click.stop="jumpAd()">{{"跳过"+(waitTime==0?"":(waitTime+"s"))}}</button>
	</view>
</template>

<script>
	import imageCache from "../../../common/js/imageCache.js";
	export default {
		name: "startAdCmp",
		props: [
			"isLogining",
			"isShowAd"
		],
		data() {
			return {
				imgInfo: uni.getStorageSync("adImgInfo") || {},
				waitTime: 5, //广告跳过计时/秒
				runJump: "" //定时器
			};
		},
		mounted() {

			this.jumpTime();

			imageCache.netImgToBase64("http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png")
				.then((data) => {
					uni.setStorage({
						key: 'adImgInfo',
						data: {
							url: data,
							link: "https://www.baidu.com",
							name: "广告页",
							id: 1
						},
						success: function() {
							console.log('缓存广告');
						}
					});
				})
		},
		methods: {

			toLink() {
				if (this.imgInfo.link) {
					clearInterval(this.runJump);
					this.waitTime = 0;
					this.$routeX.push({
						name: this.imgInfo.name,
						url: "/pages/module/webViewApp/index",
						params: {
							visitUrl: this.imgInfo.link
						}
					})
				}
			},

			/* 跳过广告计时 */
			jumpTime() {
				let nowTime = 0;
				this.runJump = setInterval(() => {
					if (nowTime < this.waitTime) {
						this.waitTime--;
					} else {
						clearInterval(this.runJump);
						if (!this.isLogining && this.isShowAd) {
							this.jumpAd();
						}
					}
				}, 1000)
			},

			/* 跳过广告 */
			jumpAd() {
				clearInterval(this.runJump);
				/* 跳转 */
				uni.switchTab({
					url: '../home/index',
				});
			}
		}
	};
</script>

<style scoped lang="less">
	.ad {
		height: 100%;
		width: 100%;
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		position: relative;
	}

	.jumpBtn {
		background: rgba(0, 0, 0, 0.5);
		color: #f8f8f8;
		position: absolute;
		/* #ifdef APP-PLUS || H5 */
		top: calc(20px + var(--status-bar-height));
		/* #endif */
		/* #ifdef MP-WEIXIN */
		bottom: 40px;
		/* #endif */
		right: 10px;
	}
</style>
