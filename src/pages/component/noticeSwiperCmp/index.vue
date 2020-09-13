<!-- UI组件 纵向滚动通知 -->
<template>
	<view class="notice-swiper-box">
		<swiper class="notice-swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="500" :circular="true"
		 :vertical="true" :disable-touch="true">

			<swiper-item v-for="(item,index) in list" :key="index" @click="item.active(item)">
				<view class="notice-swiper-item">
					<view class="notice-tag tag-view">
						<uni-tag mark="true" size="small" :text="item.tagText||'通知'" :type="item.tagBgColor"/>
					</view>
					<text class="notice-tag-cont uni-ellipsis">{{item.cont}}</text>
				</view>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
	/* 接受一个list
	 例：
	 noticeSwiperList:[
	 	{
	 		tagText:"新闻",
	 		cont:"1111111",
	 		tagBgColor:"default",
	 		active:function(data){
	 			console.log(data)
	 		}
	 	},
	 	{
	 		tagText:"通知",
	 		cont:"22222",
	 		tagBgColor:"default",,
	 		active:function(data){
	 			console.log(data)
	 		}
	 	}
	 ]
	 * 	@value default 灰色
	 * 	@value primary 蓝色
	 * 	@value success 绿色
	 * 	@value warning 黄色
	 * 	@value error 红色
	 * 	@value royal 紫色
	 */
	export default {
		name: "noticeSwiperCmp",
		props: [
			"list",
		]
	}
</script>

<style scoped lang="less">
	.notice-swiper-box {
		height: 40px;
		margin-top: 10px;
	}

	.notice-swiper {
		height: 100%;

		.notice-swiper-item {
			height: 100%;

			display: flex;
		}

		.notice-tag {
			margin: auto 0;
			min-width: 50px;
		}

		.notice-tag-cont {
			margin: auto 0;
			padding: 0 10px;
			color: #828282;
			font-size: 12px;
		}
	}
</style>
