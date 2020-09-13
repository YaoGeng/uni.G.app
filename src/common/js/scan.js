import permision from "./permission.js"
export default{
	methods: {
		async scan(callback) {
			// #ifdef APP-PLUS
			let status = await this.checkPermission();
			if (status !== 1) {
			    return;
			}
			// #endif
			uni.scanCode({
				success: (res) => {
					callback(res.result);
				},
				fail: (err) => {
					// #ifdef MP
					uni.getSetting({
						success: (res) => {
							let authStatus = res.authSetting['scope.camera'];
							if (!authStatus) {
								uni.showModal({
									title: '授权失败',
									content: '应用需要使用您的相机，请在设置界面打开相关权限',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting()
										}
									}
								})
							}
						}
					})
					// #endif
					callback(err);
				}
			});
		}
		// #ifdef APP-PLUS
		,
		async checkPermission(code) {
			let status = permision.isIOS ? await permision.requestIOS('camera') :
				await permision.requestAndroid('android.permission.CAMERA');
	
			if (status === null || status === 1) {
				status = 1;
			} else {
				uni.showModal({
					content: "需要相机权限",
					confirmText: "设置",
					success: function(res) {
						if (res.confirm) {
							permision.gotoAppSetting();
						}
					}
				})
			}
			return status;
		}
		// #endif
	}
}