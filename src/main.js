import Vue from 'vue';
import App from './App';


/* ============================= */


/* 引入http封装 */
import http from "./common/js/http"
Vue.use(http);


/* ============================= */


/* 引入vuex */
import store from './store';
Vue.prototype.$store = store;


/* ============================= */


/* 引入路由守卫封装 */
import router from './route/min-router.js'
import minRouter from './route'
Vue.use(router);


/* ============================= */


/* 全局安装openApp方法，为了调用时能走路由监听 */
import openApp from "./common/js/commonUtil.js"
Vue.use(openApp);


/* ============================= */


/* 引入moment 时间过滤器 */
import Moment from 'moment';
Vue.filter('date',function(time,type){
	return Moment(time).format(type);
});


/* ============================= */


Vue.config.productionTip = false;

App.mpType = 'app';

const app = new Vue({
	minRouter,
	store,
	...App
});
app.$mount();
