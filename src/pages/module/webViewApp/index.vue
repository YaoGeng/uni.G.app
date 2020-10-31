<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="url" @message="getMessage"></web-view>
	</view>
</template>

<script>
	import sdk from "../../../common/js/sdk.js";
	export default {
		name: "webViewApp",
		data() {
			return {
				url: '',
				webviewStyles: {
					progress: {
				        color: "<!-- @echo ui.themeColor -->"
				    }
				}
			}
		},

		onReady() {
			// #ifdef APP-PLUS
			/* app可缩放 */
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			setTimeout(function() {
				var wv = currentWebview.children()[0]
				wv.setStyle({
					scalable: true
				})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		},

		onLoad() {
			if (this.$routeParams() && this.$routeParams().visitUrl) {
				this.url = this.$routeParams().visitUrl;
			}
		},
		
		methods: {
			getMessage(event) {
				
			}
		}
	}
</script>

<style>

</style>
