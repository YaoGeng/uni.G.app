<template>
	<view class="svg-box" v-html="icon"></view>
</template>

<script>
	import iconConst from "./iconFont.js"
	export default {
		name: "aliSvg",
		props: [
			"svgId", 	 //对应主题下的svgid
			"iconTheme"  //iconFont.js里的svg主题分类
		],
		data(){
			return{
				icon:''
			}
		},
		created() {
			let reg = new RegExp(`<symbol id="${this.svgId}" viewBox="0 0 1024 1024">(.+)<\/symbol>`, 'g');
			
			let icon = 
			'<svg t="'
			+
			new Date().getTime()
			+
			'"'
			+
			'style="width: 100%;height: 100%;vertical-align: middle;fill: currentColor;overflow: hidden;"'
			+
			'viewBox="0 0 1024 1024"'
			+
			'version="1.1"'
			+
			'xmlns="http://www.w3.org/2000/svg"'
			+
			'xmlns:xlink="http://www.w3.org/1999/xlink"'
			+
			'width="200" height="200">'
			+
			reg.exec(iconConst[this.iconTheme])[1]
			+
			'</svg>';
			
			this.icon = icon;
		
		}
	}
</script>

<style lang="scss" scoped>
	
	.svg-box{
		width: 2em;
		height: 2em;
		line-height: 0;
		display: inline-block;
	}
	
</style>
