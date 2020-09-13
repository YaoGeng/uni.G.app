import Check from './min-check'

class MinRouter {
	constructor(args) {
		if (Check.isObject(args)) {
			this.routes = args.routes
		}
	}

	_push({type, path,paramsStr}) {
		return new Promise((resolve, reject) => {
			uni[type]({
				url: `${path}?params=${paramsStr}`,
				success: resolve,
				fail: reject
			})
		})
	}

	_next(args) {
		return new Promise((resolve) => {
			if (Check.isFunction(this._beforeEach)) {
				const routers = getCurrentPages()
				let route
				if (routers.length > 0) {
					const router = routers[routers.length - 1]
					route = router.route
				}
				this._beforeEach(args.path, route, args, resolve)
			} else {
				resolve(args)
			}
		})
	}

	push(args) {
		let name;
		let url;
		let params = {};
		let paramsStr = null;
		let path;
		let type;
		let isPage = false
		switch (true) {
			case Check.isObject(args):
				({
					name,
					url,
					params = {}
				} = args)
				break
			case Check.isString(args):
				url = args
				break
			default:
				throw new Error('参数必须是对象或者字符串')
		}
		if (Check.isObject(params)) {
			paramsStr = queryStr = JSON.stringify(params)
		} else {
			throw new Error('params数据必须是Object')
		}

		routes.forEach(item => {
			if (item.path === url) {
				path = item.path
				type = args.type || 'navigateTo'
				isPage = true
			}
		})

		if (!isPage) {
			throw new Error(`没有${url}页面`)
		}

		const arg = {
			name,
			type,
			path,
			paramsStr
		}

		this._next(arg).then(res => {
			switch (true) {
				case Check.isUndefined(res):
					this._push(arg)
					break
				case Check.isFalse(res):
					break
				default:
					this._push(res)
					break
			}
		})
	}

	back(delta = 1) {
		uni.navigateBack({
			delta
		})
	}

	beforeEach(func) {
		this._beforeEach = func
	}
}

let queryStr;
function parseURL() {
	const query = queryStr
	if (query) {
		return JSON.parse(query)
	} else {
		return {}
	}
}

MinRouter._beforeEach = null
MinRouter.install = function(Vue) {
	Vue.mixin({
		beforeCreate: function() {
			if (!Check.isUndefined(this.$options.minRouter)) {
				Vue._minRouter = this.$options.minRouter
			}
		}
	})
	Object.defineProperty(Vue.prototype, '$routeX', {
		get: function() {
			return Vue._minRouter
		}
	})
	Object.defineProperty(Vue.prototype, '$parseURL', {
		get: function() {
			return parseURL
		}
	})
}

const routes = []
const pageFiles = require.context('../pages/module', true, /\.vue$/)
pageFiles.keys().forEach(path => {
	const pagepath = path.replace(/^\.\/(.*)\.vue$/, '/pages/module/$1')
	routes.push({
		path: pagepath
	})
})

const router = new MinRouter({
	routes
})
console.log("路由表",routes)
export {
	router
}

export default MinRouter
