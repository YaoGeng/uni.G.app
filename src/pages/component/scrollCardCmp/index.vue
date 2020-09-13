<template>
	<view class="scrollCardCmp">
		<scroll-view :scroll-x="true" style="white-space: nowrap; display: flex;">
			<image v-for="(item, index) in list" :key="index" class="item" :src="item.imgUrl" mode="aspectFill" @click="toDetail(item)"></image>
		</scroll-view>
	</view>
</template>

<script>
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		name: "scrollCardCmp",
		props: [
			"cardInfo"
		],
		data() {
			return {
				MAIN_CONFIG: MAIN_CONFIG,
				list: []
			}
		},

		/* @Tip 纯组件中不会触发uni的页面生命周期，用vue自带的 */
		created() {
			this.initCmp();
			console.log("scrollCardCmp————init")
		},

		methods: {
			initCmp() {
				this.list = JSON.parse(this.cardInfo.contList);
			},
			toDetail(item) {
				if (commonUtil.isUrl(item.url)) {
					this.$routeX.push({
						name: this.cardInfo.mainTitle,
						url: "/pages/module/webViewApp/index",
						params: {
							visitUrl: item.url
						}
					});
				}else{
					if(this.cardInfo.linkType == 2){
						return;
					}
					this.$openApp(this.cardInfo.linkAppid);
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.scrollCardCmp {
		line-height: 0;
		margin-bottom: 15px;
	}

	.item {
		display: inline-block;
		margin-left: 15px;
		width: 85%;
		height: 100px;
		border-radius: 8px;
	}

	.item:last-child {
		margin-right: 15px;
	}
</style>
