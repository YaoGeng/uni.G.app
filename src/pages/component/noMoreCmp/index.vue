<template>
	<view class="no-more-cmp">
		<image src="/static/currency/image/home/iconfont.svg"></image>
		<view class="loading-box">
			<i class="fa fa-circle-o-notch fa-spin"></i>
			<text>
				加载中...
			</text>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: "noMoreCmp",
		props: [
			"isLoading"
		],
		data(){
			return{
				a:{}
			}
		}
	}
</script>

<style scoped lang="scss">
	.no-more-cmp{
		.loading-box{
			font-size: 14px;
			color: #747474;
			.fa-circle-o-notch{
				color:<!-- @echo ui.themeColor -->;
			}
		}
	}
</style>
