var defaultConfig = require("../mc-campus-config/default_config");

module.exports = getProjectConfig;

/**
 * 获取项目config配置
 * */
function getProjectConfig(alias){
	if(!alias) return;
	var projectConfig = loadProjectConfig(alias);

	if(!projectConfig) return defaultConfig;

	return assignDeep(defaultConfig, projectConfig);
}

/**
 * 加载项目配置文件
 * */
function loadProjectConfig(alias){
	var config = null;

	config = require(alias !== "default" ? "../mc-campus-config/spec_config/" + alias + "_config" : "../mc-campus-config/default_config");

	return config;
}

/**
 * @param target
 * @param source
 * @returns {*}
 */
function assignDeep(target, source){

	for(let prop in source){

		let isDeepAssign;

		if(!source.hasOwnProperty(prop)){ continue }

		isDeepAssign = isObject(source[prop]);

		if(isDeepAssign){
			target[prop] = isObject(target[prop]) ?
				target[prop] :
				{}
			;
		}

		target[prop] = isDeepAssign ?
			assignDeep(target[prop], source[prop]) :
			"" === source[prop] ?
				target[prop]:
				source[prop]
		;

	}

	return target;

}

function isObject(target){
	return "[object Object]" === Object.prototype.toString.call(target);
}