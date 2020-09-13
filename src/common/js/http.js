const MD5 = require("md5");
import JSEncrypt from "./jsencrypt";
/**
 * 签名请求数据
 */
function sign(rawData) {

	var sign;

	sign = Object
		.keys(rawData)
		.sort(function(prev, next) {
			return prev < next ? -1 : 1;
		})
		.map(function(prop) {
			return prop + "=" + rawData[prop];
		})
		.join("&");

	return MD5(sign);
}


function RSA() {
	let params = {
		appKey: "GiITvn",
		param: JSON.stringify({
			schoolId: MAIN_CONFIG.project.campusId || ""
		}),
		time: new Date().getTime(),
		secure: 0,
	};
	params.sign = sign(params);
	return new Promise((resolve, reject) => {
		uni.request({
			method: "post",
			url: MAIN_CONFIG.serverUrl.http + "login/getRsa.do",
			data: params,
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				"token": uni.getStorageSync("token") || "",
				"Accept-Language": "cn"
			},
			success: (res) => {
				resolve(res.data);
			},
			fail: (error) => {
				reject();
			}
		})
	})
}

function ajax(req, params) {
	return new Promise((resolve, reject) => {
		uni.request({
			method: req.method || "post",
			url: req.url,
			data: params,
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				"token": uni.getStorageSync("token") || "",
				"Accept-Language": "cn"
			},
			success: (res) => {

				if (res.statusCode == 404) {
					uni.showToast({
						title: "请求接口不存在",
						icon: "none",
						position: 'bottom'
					})
					reject();
				} else if (res.statusCode == 200) {
					if (res.data.msgState == 1) {
						resolve(res.data);
					} else if (res.data.msgState == 2) {

						/* 自定义抛错 */
						if (req.custom) {
							reject(res.data);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none",
								position: 'bottom'
							})
							reject(res.data);
						}

					}

				}

			},
			fail: (error) => {
				console.error("请求失败：" + req.url);
				uni.showToast({
					title: "请求接口失败",
					icon: "none",
					position: 'bottom'
				})
				reject()
			}
		});
	})
}

function http(req) {

	let params = {
		appKey: "GiITvn",
		param: req.data ? JSON.stringify(req.data) : JSON.stringify({}),
		time: new Date().getTime(),
		secure: req.isSecure ? 1 : 0,
		schoolId: MAIN_CONFIG.project.campusId || ""
	};

	params.sign = sign(params);

	if (req.isSecure) {
		return RSA()
			.then((res) => {
				let crypt = new JSEncrypt(),
					secrets;
				crypt.setPublicKey(res.publicKey);
				secrets = crypt.encrypt(params.param);
				params.param = secrets;
				return ajax(req, params);
			})
	} else {
		return ajax(req, params);
	}
}

/**
 * http请求封装
 * @description http请求封装按兰途接口模式，有msg抛错弹窗提示
 * @value method 非必 post(默认)|get  请求方式
 * @property {Object} data 非必 请求参数
 * @value url 必 string  地址
 * @value custom 非必 Bulr false(默认undefind)|true  是否自定义抛错
 * @value isSecure 非必 Bulr false(默认undefind)|true  是否加密请求
 */
export default {

	sign: sign,

	install(Vue) {
		Vue.prototype.$http = http
	}
}
