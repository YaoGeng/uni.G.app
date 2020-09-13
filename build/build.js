const shell = require("shelljs");
const path = require('path')

const getArgv = require("./getProcessArgv");
let arg = [];
try {
	arg = JSON.parse(process.env.npm_config_argv).original;
} catch (e) {
	arg = process.argv;
}


if(getArgv("U", arg)){
	console.log("更新uni架包");
	shell.exec("npm update");
}


/* 获取项目别称 */
let alias = getArgv("alias", arg) || "prime";
console.log("获取别称:" + alias);



/* 构建重导配置文件 */
console.log("构建重导配置文件pages.json和manifest.json");
[
	path.join(__dirname, '../uniapp-config/' + alias + '/pages.json'),
	path.join(__dirname, '../uniapp-config/' + alias + '/manifest.json')
].forEach((cmd) => {
	shell.cp('-R', cmd, path.join(__dirname, '../src'));
});



/* 构建重导资源文件 */
const fileWatch = require("./chokidarWatch");
console.log("构建重导res下资源文件");
fileWatch.rmStatic(alias);
