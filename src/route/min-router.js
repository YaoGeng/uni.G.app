let _beforeEach = null;

const routeList = [];

const pageFiles = require.context('../pages/module', true, /\.vue$/);

pageFiles.keys().forEach(path => {
	routeList.push({
		path: path.replace(/^\.\/(.*)\.vue$/, '/pages/module/$1')
	})
})

console.log("路由表",routeList)

/* 执行原始跳转方法 */
const _push = (args)=>{
	return new Promise((resolve, reject) => {
		uni[args.type]({
			url: `${args.url}${args.params?`?params=${encodeURIComponent(JSON.stringify(args.params))}`:``}`,
			success: resolve,
			fail: reject
		})
	})
}

/* 守卫传参 */
const _next = (args) => {
	return new Promise((resolve) => {
		let afterRoute
		if (routeList.length > 0) {
			afterRoute = getCurrentPages()[getCurrentPages().length - 1].route
		}
		_beforeEach(args.url, afterRoute, args, resolve)
	})
}

/* 外部调用push */
 const push = (args) => {
	const isPage = routeList.find(item => {
		return item.path === args.url
	})
	if (!isPage) {
		throw new Error(`没有${args.url}页面`)
	}
	args.type = args.type || 'navigateTo'
	_next(args).then(() => {
		_push(args)
	})
}

/* 返回 */
const back = (delta = 1) => {	
	uni.navigateBack({
		delta
	})
}

/* 传入前置函数 */
const beforeEach = (func) => {
	_beforeEach = func
}

/* 获取参数，防止h5刷新失去传参 */
const routeParams = () => {
	let curParam = getCurrentPages()[getCurrentPages().length - 1].options;
	let param = ''
	for (let key in curParam) {
		param += '&' + key + '=' + curParam[key]
	}
	param = param.substr(8); //去除 &params=
	return JSON.parse(param);	
}

export default {
	install(Vue) {
		Vue.prototype.$routeLink = {
			back,
			push
		}
		Vue.prototype.$routeParams = routeParams
	},
	beforeEach,
}
