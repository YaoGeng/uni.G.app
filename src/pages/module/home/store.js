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
				"imgLink": "https://www.baidu.com",
				"imgSeq": 1,
				"imgUrl": "http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png",
			}, {
				"appId": 0,
				"appName": "首页",
				"id": 976,
				"imgLink": "https://www.baidu.com",
				"imgSeq": 2,
				"imgUrl": "http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png",

			}, {
				"appId": 0,
				"appName": "首页",
				"id": 977,
				"imgLink": "https://www.baidu.com",
				"imgSeq": 3,
				"imgUrl": "http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png",
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
