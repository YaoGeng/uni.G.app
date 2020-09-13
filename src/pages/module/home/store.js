import imageCache from "../../../common/js/imageCache.js"
export default {

	namespaced: true,

	state: {
		bannerList: [],
		cardList: []
	},

	mutations: {

	},

	getters: {},

	actions: {
		getBannerList(state, payload) {
			let list = [{
				"appId": 0,
				"appName": "首页",
				"id": 975,
				"imgLink": "",
				"imgSeq": 1,
				"imgUrl": "",
			}, {
				"appId": 0,
				"appName": "首页",
				"id": 976,
				"imgLink": "",
				"imgSeq": 2,
				"imgUrl": "",

			}, {
				"appId": 0,
				"appName": "首页",
				"id": 977,
				"imgLink": "",
				"imgSeq": 3,
				"imgUrl": "",
			}]
			return Promise.all(list.map(item => imageCache.netImgToBase64(item.imgUrl)
					.then((data) => {
						item.imgBase64 = data;
						return item;
					})
				))
				.then((data) => {
					state.bannerList = data;
					let arr = [];
					data.forEach((item) => {
						if (item.appId == 0) {
							//首页
							arr.push(item)
						}
					})
					return arr;
				})
		},

		getCardList(state, payload) {
			let that = payload.that;
			return 
		}
	}
}
