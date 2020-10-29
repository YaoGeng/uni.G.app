//获取项目配置↓

const shell = require("shelljs");
const getAlias = require("./build/getAlias")
let alias = getAlias();
let getProjectConfig = require("./build/getConfig");
let projectConfig = getProjectConfig(alias);

console.log("运行项目：" + projectConfig.project.name+"\n↓↓↓");

//获取项目配置↑



/* 执行监听脚本 */
if(process.env.NODE_ENV === 'development'){
	const fileWatch = require("./build/chokidarWatch");
	fileWatch.nodeWatch(alias);
	fileWatch.chokidarRead(alias);
	console.log("执行监听res和uniapp-config------------"+"目标alias："+alias+"\n↓↓↓")
}
/* 执行监听脚本 */



/*插件↓ （uni中npm三方依赖用require.resolve()引入,use()、loader()直接使用不加new）*/

const path = require('path');
// const preprocessLoader = require.resolve("preprocess-loader");

/*插件↑*/




module.exports = {

	configureWebpack: (config) => {

	},

	chainWebpack: (config) => {

		/* 全局样式 */
		if(process.env.NODE_ENV === 'development'){
			const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
			types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)));
		}
		

		/*webpack define用于使用项目配置项 MAIN_CONFIG 对象,相当于store里一个全局状态 .js.vue中直接使用*/
		config
			.plugin('define')
			.tap(args => {
				args[0].MAIN_CONFIG = JSON.stringify(projectConfig);
				return args;
			})
			.end();

		/*preprocess-loader 用于条件编译 @if @echo*/
		config.module.rule("js")
			.test(/\.js$/)
			.use("preprocess-loader")
			.loader("preprocess-loader")
			.options(projectConfig);
		config.module.rule("vue")
			.test(/\.vue$/)
			.use("preprocess-loader")
			.loader("preprocess-loader")
			.options(projectConfig);
		
		/* 处理nvue文件 */
		config.module.rule("nvue")
			.test(/\.nvue$/)
			.use("vue-loader")
			.loader("vue-loader");
	}
};

/* 全局样式导入 */
function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, 'src/common/css/_index.less')
			],
		})
}
