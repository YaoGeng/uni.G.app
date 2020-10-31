/* 
	跳转
	this.$routeLink.push({
		type: "navigateTo" uni跳转类型 非必
		name: "xxx",
		url: "/pages/module/xxx/xxx",
		params: {} //可选
	});
	
	接收参数
	onLoad()下
	this.$routeParams().xxx
 
 */

import router from './min-router.js'

let routeTimeOver = true;

// 全局路由拦截器
router.beforeEach((to, from, args, next) => {

	console.log("路由跳转:\n","前往:"+to+"\n", "来自:"+from+"\n", args)

	//避免连点重复跳转
	if(routeTimeOver){
		routeTimeOver = false;
		setTimeout(()=>{
			routeTimeOver = true;
		},500);
		
		next();
		
		/* 设title */
		if(!args.name){
			return;
		}
		uni.setStorageSync("thisPageInfo", args);
		setTimeout(()=>{
			uni.setNavigationBarTitle({
				title: args.name
			});
		},100)
		
	}else{
		return;
	}
		
})

export default router
