# uni

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev:<mode> --alias <xxx>
```

### Compiles and minifies for production
```
npm run build:<mode> --alias <xxx>
```

### HBuilderX 运行时靠读取src下manifest.json中description字段值获取项目alias的，所以没有run dev前直接打包的话，执行 npm run copy --alias <xxx> 保证src下配置文件是对应alias的资源

# 此项目适用于 webapp或h5 仅供学习参考

## 打app时nvue文件预处理样式抛错不用管，nvue文件用于处理原生app渲染时媒体容器层级等问题，详细使用见官方文档



构建命令
	npm run +
		"copy" 替换项目配置文件
		见官方文档
        "build:app-plus" 支持
        "build:custom"
        "build:h5" 支持
        "build:mp-alipay"
        "build:mp-baidu"
        "build:mp-qq"
        "build:mp-toutiao"
        "build:mp-weixin" 支持
        "dev:app-plus" 支持
        "dev:custom"
        "dev:h5" 支持
        "dev:mp-alipay"
        "dev:mp-baidu"
        "dev:mp-qq"
        "dev:mp-toutiao"
        "dev:mp-weixin" 支持
        "info"


目录结构
	mc-campus-config —— 开发时使用配置文件
	
	uniapp-config —— 每个uniapp专用配置和路由 已监听 修改后会替换到src下
		manifest.json —— app配置
		pages.json —— 路由及页面配置
	
	res —— 开发时静态资源直接放这里 已监听文件变化
		commonStatic —————————————— 公共资源 对应 src/static/commonStatic
			image ————————————— 图片资源
			other ————————————— 其他资源mp3等
		<alias>  —————————————— 别名目录
			image ————————————— 图片资源
			other ————————————— 其他资源mp3等
			
	src 
		common —— 公共资源
		components —— uni自带组件库（不用import 需大量使用的组件可放此）
		hybrid —— 本地html页面及相关资源存放目录
		route —— 拟vue-router封装服务目录
		pages
			module —— 页面
			component —— 公用组件
		static —— 静态资源目录（只能放这里，监听res中文件变化，替换到static下）git已排除
			aliasStatic —— 别名资源
			commonStatic  ———— 公共资源
		store —— 公共状态仓库
		manifest.json —— app配置（会被替换，git排除）
		pages.json —— 路由及页面配置（会被替换，git排除）

使用教程
	拉取工程
	使用npm i装依赖
	
	运行
		使用命令行 npm run dev:h5 --alias xxx
		使用ide npm run copy --alias 项目别名 
##  注：使用ide中运行功能时，包括模拟器，真机，浏览器，第一次都copy一下生成src下所需配置文件及资源文件，切换项目时再次copy，）
		
		
	开发
		用HBuildX建一个带所有api及组件的模板，可参照（照抄）开发
	
	构建打包
		debug包（ios看看官方文档）
			命令 npm run build:app-plus --alias 项目别名 （建议直接用ide打）
			运行>制作自定义基座>配置   确定开始打包，会上传云打包，也会本地生成，需等待一会提示包路径
			插上真机运行会直接在手机上安装
		产品包
			云打包 安卓ios证书包都需证书
			本地 （生成本地打包资源，用android studio打，比较麻烦）
			热更新 （待研）

	
	
##	资源监听相关：
		已监听uniapp-config下文件更改(增删不做监听，手动处理)
		已监听res下资源文件，包括新增目录，目前为异步处理，shell可能抛错（暂无复现），抛错时重新执行npm即可。
		
##	config配置项相关：
		@if @endif @echo 在 .vue / .js
		vue文件中都用<!-- -->语法，script中esLint抛错看着不舒服可改为/*<!-- -->*/,js文件中使用/*  */
		
##  新建应用
		
		新建应用：
			xxx
			
			uniapp-config/xxx/pages.json
				添加静态路由地址，页面相关配置见官方文档
				
			媒体标签出现相关渲染问题使用nvue文件进行原生渲染，或者使用本地html文件webview嵌入，如地图
			
		更多开发相关，见已有模块
		
		ali-svg预览地址：阿里矢量库

		svg库更新方式：
			1.阿里矢量库项目中Symbol方式下载
			2.打开包中iconfont.js文件
			3.复制<svg></svg>标签中所有内容
			4.ali-svg组件目录下新建js文件主题命名，粘贴复制的代码，export default 字符串导出
			5.组件vue文件中引入js
			（由于Symbol使用windows对象，uni不支持，所以用主题id匹配这种方式）

###  更多问题请咨询、多看看文档和已有模块代码，坑填得差不多了已经。
			
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
