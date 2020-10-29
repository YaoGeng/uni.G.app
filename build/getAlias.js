const getArgv = require("./getProcessArgv");
module.exports = function () {
    let arg = [];
    try {
        arg = JSON.parse(process.env.npm_config_argv).original;
    } catch (e) {
        arg = process.argv;
    }

    let alias = getArgv("alias", arg) || "default";

    try {
        require("../mc-campus-config/spec_config/" + alias + "_config");
    } catch (e) {
        console.log(`未获取到对应业务app配置文件，以默认执行\n↓↓↓`);
        alias = "default";
    }
    return alias;
}