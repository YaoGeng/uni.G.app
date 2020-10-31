<template>
	<view class="imgTextXCardCmp">
		<view class="imgTextXCardCmp-item" v-for="(item,index) in list" :key="index" :style="{'border-right':index%2?'none':'1rpx solid #e2e2e2'}" @click="toLink(item)">
			<view class="imgTextXCardCmp-text uni-ellipsis">
				<text class="mainTitle uni-ellipsis">{{item.mainTitle}}</text>
				<uni-tag v-if="item.tip" style="max-width: 80%" size="small" inverted="true" :text="item.tip" type="error"/>
				<text v-if="item.childTitle" class="childTitle uni-ellipsis">{{item.childTitle}}</text>
			</view>
			<image class="imgTextXCardCmp-img" :src="item.imgUrl" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		name: "imgTextXCardCmp",
		props: [
			"cardInfo"
		],
		data() {
			return {
				list:[]
			}
		},
		created() {
			this.list = JSON.parse(this.cardInfo.contList)
		},
		methods:{
			toLink(item){
				if (commonUtil.isUrl(item.url)) {
					this.$routeLink.push({
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
	.imgTextXCardCmp{
		
		.imgTextXCardCmp-item{
			float: left;
			width: 49.99%;
			display: flex;
			justify-content: space-between;
			padding: 0 15px;
			margin: 0 0 15px;
			box-sizing: border-box;
		}
		
		.imgTextXCardCmp-text{
			flex: 1;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			
			.mainTitle{
				font-size: 12px;
			}
			.childTitle{
				font-size: 10px;
				color:#B2B2B2;
			}
		}
		
		.imgTextXCardCmp-img{
			margin: auto;
			height: 50px;
			width: 50px;
			border-radius: 50%;
			box-shadow: 0 0 3px rgba(0,0,0,0.2);
		}
	}
</style>
