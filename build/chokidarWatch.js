const path = require('path')
const Chokidar = require('chokidar');
const watch = require('node-watch');
const shell = require("shelljs");
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

/* chokidar监听配置文件变化 只监听变化 新增删除不做处理 */
function chokidarRead(alias) {
	/* 配置文件 */
	const watcherConfig = Chokidar.watch(path.join(__dirname, '../uniapp-config/' + alias + "/"), {
		persistent: true,
		usePolling: true,
	});
	watcherConfig
		.on('ready', () => {
			let watchActionConfig = function ({
				event,
				eventPath
			}) {
				// 这里进行文件更改后的操作
				console.log(event + eventPath);
				[
					path.join(__dirname, '../uniapp-config/' + alias + '/pages.json'),
					path.join(__dirname, '../uniapp-config/' + alias + '/manifest.json')
				].forEach((cmd) => {
					shell.cp('-R', cmd, path.join(__dirname, '../src'));
				});
				console.log('替换完成');
			}
			watcherConfig.on('change', path => watchActionConfig({
				event: '更改',
				eventPath: path
			}));
		});
}

/* node-watch监听资源变化 监听增删改 替换static */
function nodeWatch(alias) {
	let watchOver;

	/* 监听公共资源文件夹 */
	watch(path.join(__dirname, '../res/commonStatic/'), {
		recursive: true
	}, (evt, name) => {
		console.log('%s changed', evt, name);
		clearTimeout(watchOver);
		watchOver = setTimeout(() => {
			console.log("资源更改，执行替换")
			rimraf(path.join(__dirname, '../src/static/commonStatic'), (err) => {
				setTimeout(() => {
					currencyMkdir();
				}, 100)
			});
		}, 100);
	});

	/* 只做当前别名资源文件夹监听 */
	watch(path.join(__dirname, '../res/' + alias + '/'), {
		recursive: true
	}, (evt, name) => {
		console.log('%s changed', evt, name);
		clearTimeout(watchOver);
		watchOver = setTimeout(() => {
			console.log("资源更改，执行替换")
			rimraf(path.join(__dirname, '../src/static/aliasStatic'), (err) => {
				setTimeout(() => {
					aliasStaticMkdir(alias);
				}, 100)
			});
		}, 100);
	});
}

/* 删除原static */
function rmStatic(alias) {
	rimraf(path.join(__dirname, '../src/static/commonStatic'), (err) => {
		setTimeout(() => {
			currencyMkdir();
		}, 100)
	});
	rimraf(path.join(__dirname, '../src/static/aliasStatic'), (err) => {
		setTimeout(() => {
			aliasStaticMkdir(alias);
		}, 100)
	});
}

/* 创建复制公共资源 */
function currencyMkdir() {
	shell.cp('-Rf', path.join(__dirname, '../res/commonStatic/'), path.join(__dirname, '../src/static/'));
}

/* 创建复制别名资源 */
function aliasStaticMkdir(alias) {
	shell.cp('-Rf', path.join(__dirname, `../res/${alias}/`), path.join(__dirname, '../src/static/aliasStatic'));
}

module.exports = {
	chokidarRead: chokidarRead,
	nodeWatch: nodeWatch,
	rmStatic: rmStatic
};
