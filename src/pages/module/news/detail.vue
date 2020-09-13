<template>
	<view class="news-detail">
		<view class="top-box">
			<text class="new-title">{{newsInfo.title}}</text>
			<view class="other-info">
				<text>{{newsInfo.updateTime | date("YYYY-MM-DD hh:mm")}}</text>
				<text style="margin-left: 15px;">来源：{{newsInfo.from || "暂无"}}</text>
			</view>
		</view>
		<jyf-parser class="news-html" :html="newsInfo.content" ref="article"></jyf-parser>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newsInfo: "",
			}
		},
		onLoad() {
			this.$http({
				url: MAIN_CONFIG.serverUrl.httpNews + "news/getNewsInfo.do",
				data: {
					newsId: this.$parseURL().newsId
				}
			}).then((res) => {
				this.newsInfo = res.newsInfo;
			})
		}
	}
</script>

<style scoped lang="less">
	.news-detail {
		background-color: #fff;

		.top-box {
			padding: 15px;
			display: flex;
			flex-direction: column;

			.new-title {
				font-size: 20px;
				font-weight: bold;
			}

			.other-info {
				color: #8b8b8b;
			}
		}

		.news-html {
			padding: 15px;
		}
	}
</style>
