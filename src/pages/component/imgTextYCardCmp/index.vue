<template>
	<view class="imgTextYCardCmp">
		<view class="imgTextYCardCmp-item" v-for="(item,index) in list" :key="index" @click="toLink(item)">
			<image class="imgTextYCardCmp-img" :src="item.imgUrl" mode="aspectFill"></image>
			<text class="mainTitle uni-ellipsis">{{item.mainTitle}}</text>
			<uni-tag v-if="item.tip" class="uni-ellipsis" style="max-width: 80%;" size="small" inverted="true" :text="item.tip" type="error"/>
			<text v-if="item.childTitle" class="childTitle uni-ellipsis">{{item.childTitle}}</text>
		</view>
	</view>
</template>

<script>
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		name: "imgTextYCardCmp",
		props: [
			"cardInfo"
		],
		data() {
			return {
				list: []
			}
		},
		created() {
			this.list = JSON.parse(this.cardInfo.contList)
		},
		methods: {
			toLink(item) {
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
	.imgTextYCardCmp {
		padding-left: 15px;

		.imgTextYCardCmp-item {
			float: left;
			width: 33.3%;
			display: flex;
			flex-direction: column;
			padding-right: 15px;
			margin: 0 0 15px;
			box-sizing: border-box;
			text-align: left;
		}

		.mainTitle {
			margin-top: 4px;
			font-size: 12px;
		}

		.childTitle {
			font-size: 10px;
			color: #B2B2B2;
		}

		.imgTextYCardCmp-img {
			margin: auto;
			height: 100px;
			width: 100%;
			border-radius: 8px;
		}
	}
</style>
