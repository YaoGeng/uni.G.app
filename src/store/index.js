import Vue from 'vue';
import Vuex from 'vuex';
import commonUtil from "../common/js/commonUtil.js";

//登录页
import login from "../pages/module/login/store.js";
//首页
import home from "../pages/module/home/store.js";



Vue.use(Vuex);

const store = new Vuex.Store({
	
	modules:{
	    login:login,
	    home:home
	},
	
});

export default store;
