/* 
	跳转
	this.$routeX.push({
		name: "xxx",
		url: "/pages/module/xxx/xxx",
		params: {} //可选
	});
	
	接收参数
	onLoad()下
	this.$parseURL().xxx
 
 */

import { router } from '@/route/min-router.js'

let routeTimeOver = true;

// 全局路由拦截器
router.beforeEach((to, from, args, next) => {
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
