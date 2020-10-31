import Vue from 'vue';
import minRouter from '../../route'
import router from '../../route/min-router.js'
Vue.use(router);

import http from "./http"
Vue.use(http);

/* 输出 */
export default {
	setUid: setUid,
	install(Vue) {
		Vue.prototype.$openApp = openApp
	},
	urlToJson: urlToJson,
	isUrl: isUrl,
	timeStorage:timeStorage
};




/**
 * 生成uuid
 * @param { Number } [count] 几倍8位长度
 * @returns {string}
 */
function setUid(count) {
	if ("number" !== typeof count || count !== count) {
		count = 2;
	}

	return (count <= 1 ? "" : setUid(--count)) +
		(Number((Math.random() + "").slice(2, 10) + ((new Date()).getTime() + "").slice(-10)).toString(16) + "").slice(0, 8);
}




/* 打开应用 */
function openApp(appId, data) {
	
	let appInfo = uni.getStorageSync("allAppList").find((item)=>{
		return item.appId == appId;
	})

	if(!appInfo){
		uni.showToast({
			title: "应用不存在，请联系管理员",
			icon: "none",
			position: 'bottom'
		})
		return;
	};

	switch (Number(appInfo.integrate)) {
		case 1: //打开内置应用

			//双平台嵌套处理
			if (isUrl(appInfo.visitUrl)) {
				//旧平台中有此应用且新平台可使用h5g访问
				let visitUrl = urlSearchSet(appInfo.visitUrl);
				console.log("打开网络地址：" + visitUrl);
				let appInfoCopy = appInfo;
				appInfoCopy.visitUrl = visitUrl;
				this.$routeLink.push({
					name: appInfo.name,
					url: "/pages/module/webViewApp/index",
					params: appInfoCopy
				})
			} else {
				//只有新平台有的应用
				console.log("打开内置应用：", appInfo.name);
				this.$routeLink.push({
					name: appInfo.name,
					url: appInfo.visitUrl,
					params: appInfo
				})
			}
			break;

		case 2: //打开网页应用

			let visitUrl = urlSearchSet(appInfo.visitUrl);

			// if (!isUrl(visitUrl)) {
			// 	uni.showToast({
			// 		title: "应用地址错误，请联系管理员",
			// 		icon: "none",
			// 		position: 'bottom'
			// 	})
			// 	return;
			// }

			console.log("打开网络地址：" + visitUrl);

			let appInfoCopy = appInfo;
			appInfoCopy.visitUrl = visitUrl;

			// #ifdef APP-PLUS
			/* APP端 */
			if (appInfo.embedType != 4) {
				this.$routeLink.push({
					name: appInfo.name,
					url: "/pages/module/webViewApp/index",
					params: appInfoCopy
				})
			} else {
				plus.runtime.openURL(visitUrl) //使用外部浏览器
			}
			// #endif

			// #ifdef H5
			/* H5端 */
			if (appInfo.embedType != 4) {
				this.$routeLink.push({
					name: appInfo.name,
					url: "/pages/module/webViewApp/index",
					params: appInfoCopy
				})
			} else {
				window.open(visitUrl)
			}
			// #endif

			// #ifdef MP-WEIXIN
			this.$routeLink.push({
				name: appInfo.name,
				url: "/pages/module/webViewApp/index",
				params: appInfoCopy
			})
			// #endif
			break;

		case 3: //打开外部应用
			// #ifdef APP-PLUS
			if (plus.os.name == "Android") {
				plus.runtime.launchApplication({
					pname: appInfo.packageName //包名
				}, function(e) {
					plus.runtime.openURL(appInfo.downloadUrl); //安卓下载链接
				});
			} else if (plus.os.name == "iOS") {
				plus.runtime.launchApplication({
					action: appInfo.openUrlIOS //scheme
				}, function(e) {
					plus.runtime.openURL(appInfo.downloadUrlIOS); //ios商店地址
				});
			};
			// #endif
			// #ifdef H5 || MP-WEIXIN
			uni.showToast({
				title: "请在app打开",
				icon: "none",
				position: 'bottom'
			})
			// #endif
			break;
	}
}




/* 插值处理 */
function urlSearchSet(url) {

	let visitUrl = url;

	let searchJson = urlToJson(visitUrl);

	for (let i in searchJson) {
		//单独处理token
		if (searchJson[i].match(/{{(\S*)}}/)) {
			if (searchJson[i].match(/{{(\S*)}}/)[1] == "token") {
				visitUrl = visitUrl.replace(/{{token}}/g, uni.getStorageSync("token"))
			} else {
				let str = searchJson[i].match(/{{(\S*)}}/)[1];
				let reg = new RegExp("{{" + str + "}}");
				if (uni.getStorageSync("userInfo")[str]) {
					visitUrl = visitUrl.replace(visitUrl.match(reg), uni.getStorageSync("userInfo")[str])
				}
			}
		}
	}
	return visitUrl
}




/* url参数获取 */
function urlToJson(url) {

	if (url.indexOf("?") === -1) {
		return {};
	}

	var
		appUrlRear = url.split("?")[1] || "",
		tempSplit = appUrlRear.split("&") || [],
		strJson = "";

	for (var i = 0; i < tempSplit.length; i++) {
		var tempHehe = tempSplit[i].split("=");
		if (i > 0) {
			strJson += ",";
		}
		strJson += "\"" + tempHehe[0] + "\":\"" + tempHehe[1] + "\"";
	}

	strJson = "{" + strJson + "}";

	try {
		return JSON.parse(strJson);

	} catch (e) {
		return {};
	}
}




/* 判断是否为url */
function isUrl(url) {
	var strUrl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var urlDemo = new RegExp(strUrl);

	if (!urlDemo.test(url)) {
		return false;
	} else {
		return true;
	}
}




/** 
 *  @description 定时缓存 
 *	@value onf.key string 键
 *  @value onf.seconds number 缓存时间/天
 *  @value onf.url string 无缓存请求接口
 *  @value onf.params object 无缓存请求参数
 *  @value onf.needKey string 请求参数缓存字段
 */
function timeStorage(onf, callback) {
	
	onf = {
		key:onf.key||"",
		seconds:onf.seconds||1,
		url:onf.url||"",
		params:onf.params||{},
		needKey:onf.needKey||"",
	}
	
	let val = uni.getStorageSync(onf.key),
	nowTime = new Date().getTime();
	if(val){
		if(val.time>nowTime){
			//没过期
			return val
		}else{
			Vue.prototype.$http({
				url:onf.url,
				data:onf.params
			}).then((res)=>{
				uni.removeStorageSync(onf.key);
				val.data = res[onf.needKey];
				val.time = (onf.seconds * 60 * 60 * 1000 * 24)+nowTime;
				uni.setStorageSync(onf.key,val);
				callback(val.data);
			});
		}
	}else{
		Vue.prototype.$http({
			url:onf.url,
			data:onf.params
		}).then((res)=>{
			val = {};
			val.data = res[onf.needKey];
			val.time = (onf.seconds * 60 * 60 * 1000 * 24)+nowTime;
			uni.setStorageSync(onf.key,val);
			callback(val.data);
		});
	}
}
