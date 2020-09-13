import commonUtil from "../../../common/js/commonUtil.js";
export default {

	namespaced: true,

	state: {},

	mutations: {
		/* 处理各类应用列表 */
		filterAppList: state => {
			let topAppList 	 	= 	[], //2 首页顶部应用 4个
				storeAppList 	= 	[], // 1 应用市场中应用
				userAppList 	=	[], //8 个人页应用栏应用 4个
				setAppList	 	= 	[], //9 设置页应用
				allAppList 		= 	[]; //全部应用
			let loginInfo = uni.getStorageSync("loginInfo") || [];

			loginInfo.appInfoList.forEach((item) => {
				item.isUrlIcon = commonUtil.isUrl(item.icon);
				if (item.defaultPage == 2) {
					topAppList.push(item);
				} else if (item.defaultPage == 1) {
					storeAppList.push(item);
				} else if (item.defaultPage == 8) {
					userAppList.push(item);
				} else if (item.defaultPage == 9) {
					setAppList.push(item);
				}
				allAppList.push(item);
			})

			/* 内存中缓存 */
			uni.setStorageSync("storeAppList", storeAppList);
			uni.setStorageSync("topAppList", topAppList);
			uni.setStorageSync("userAppList", userAppList);
			uni.setStorageSync("setAppList", setAppList);
			uni.setStorageSync("allAppList", allAppList);

		},

	},

	getters: {},

	actions: {}
}
