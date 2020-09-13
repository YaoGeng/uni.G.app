<template>
	<view class="c-card">
		<view class="card-top" @click="didClick()">
			<text class="title">{{title||""}}</text>
			<text v-if="other" class="other">{{other}}</text>
			<ali-svg class="other-svg"  v-if="!other" svg-id="icon-forward_flat" icon-theme="pingMianColor"></ali-svg>
		</view>
		<view class="card-cont animation-in">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/*
	 "title", //卡片标题
	 "other"  //右侧内容
	 "didClick"  //点击右侧回调
	 */
	export default {
		name: "cardCmp",
		props: [
			"title",
			"other"
		],
		data() {
			return {
				
			}
		},
		methods: {
			didClick() {
				this.$emit('didClick');
			}
		}
	}
</script>

<style scoped lang="less">
	.c-card {
		.card-top {
			height: 50px;
			display: flex;
			justify-content: space-between;
		}

		.title {
			margin: auto 15px;
			font-size: 14px;
			font-weight: bold;
		}

		.other {
			margin: auto 15px;
			font-size: 12px;
			color: #B2B2B2
		}
		
		.other-svg{
			margin: auto 15px;
			width: 1.5em;
			height: 1.5em;
		}
		
		.card-cont{
			overflow: hidden;
		}
	}
</style>
