module.exports = {
	project: {
		alias: "LtAppStore",
		name: "兰途大学",
		campusId: 136
	},

	serverUrl: {
		http: "https://www.app8848.com/baseCampus/",
		httpNews:"https://www.app8848.com/newsCampus/",
		httpInterface:"https://www.app8848.com/interface/rest/http/"
	},

	/* UI配置 */
	ui: {
		themeColor:"#1cb3cc",
		bodyBgColor:"#fff"
	},
	
	/* 模块配置 */
	pages: {
		login:{
			hasForgetPWD:true, //显示忘记密码
		}
	}
};
