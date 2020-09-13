var minimist = require('minimist');

module.exports = function(name, argList){
	if(!name.trim() || typeof name !== "string") return "";
	return minimist(argList || process.argv)[name] || '';
};
