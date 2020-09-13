module.exports = {
	project: {
		alias: "prime",
		name: "兰途大学",
		campusId: 350
	},

	serverUrl: {
		http: "https://www.app8848.com/baseCampus/",
		httpNews:"https://www.app8848.com/newsCampus/",
		httpInterface:"https://www.app8848.com/interface/rest/http/"
	},

	/* UI配置 */
	ui: {
		themeColor:"#1cb3cc",
		bodyBgColor:"#f8f8f8"
	},
	
	/* 模块配置 */
	pages: {
		login:{
			hasForgetPWD:true, //显示忘记密码
		}
	}
};
