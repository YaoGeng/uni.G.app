<script>
	export default {
		onLaunch: () => {
			console.log('App Launch配置', MAIN_CONFIG);

			//清除token后刷新到登录
			//#ifdef H5
			uni.getStorage({
				key: "token",
				success: () => {
					// setTimeout(()=>{
					// 	uni.setNavigationBarTitle({
					// 		title: uni.getStorageSync("thisPageInfo").name
					// 	});
					// },100)
				},
				fail: () => {
					uni.clearStorage();
					uni.reLaunch({
						url: "./",
					})
				}
			});
			//#endif


			//#ifdef APP-PLUS  
			var info = plus.push.getClientInfo();
			console.log(JSON.stringify(info));
			plus.push.addEventListener("click", function(msg) {
				uni.showModal({
					title: '提示',
					content: JSON.stringify(msg),
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}, false);


			// 监听在线消息事件    
			plus.push.addEventListener("receive", function(msg) {
				uni.showModal({
					title: '提示',
					content: JSON.stringify(msg),
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}, false);
			//#endif  
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */

	/* #ifndef APP-PLUS-NVUE */
	
	/* #ifdef APP-PLUS || H5 */
	@import "./common/css/font-awesome.css";
	/* #endif */
	
	/* #ifdef MP-WEIXIN */
	@import "./common/css/font-awesome.wxss.css";
	/* #endif */
	
	@import "./common/css/uni.css";
	@import "./common/css/flexStyle.less";
	@import "./common/css/common.css";
	@import "./common/css/animation.scss";

	body,
	html,
	page {
		height: 100%;
		font-size: 14px;
		color: #1b1b1b;
		background: <!-- @echo ui.bodyBgColor -->;
		word-wrap: break-word;
		word-break: normal;
	}

	/* #endif */
	/* 需要按项目配置输出的UI */
</style>
