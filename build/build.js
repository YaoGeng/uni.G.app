const shell = require("shelljs");
const path = require('path')
const fs = require('fs')

/* 单纯获取构建命令别称 */
const getAlias = require("./getAlias")
let alias = getAlias();

console.log("获取别称:" + alias+"\n↓↓↓");

/* 构建重导配置文件 */
console.log("构建重导配置文件pages.json和manifest.json\n↓↓↓");
[
	path.join(__dirname, '../uniapp-config/' + alias + '/pages.json'),
	path.join(__dirname, '../uniapp-config/' + alias + '/manifest.json')
].forEach((cmd) => {
	shell.cp('-R', cmd, path.join(__dirname, '../src'));
});



/* 构建重导资源文件 */
const fileWatch = require("./chokidarWatch");
console.log("构建重导res下资源文件\n↓↓↓");

let stat = fs.existsSync(path.join(__dirname, '../res/' + alias)); 

fileWatch.rmStatic(stat?alias:'default');




