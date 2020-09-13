<template>
	<view class="p-flex-box app-store">

		<view class="p-flex-box__flexd drag-box">
			<card-cmp title="我的应用" :other="isEdit?'完成':'编辑'" @didClick="edit()">
				<!-- 拖动编辑 -->
				<drag-cmp :columns="5" :list-data="myAppList" @change="dragChange" bindKey="appId" v-if="isEdit">
					<view slot-scope="item" class="app-item-box">
						<view class="app-item edit-shadow">
							<i class="fa fa-minus-square del-icon" @click.stop="dragItemDel(item.index)"></i>
							<image class="app-item-img" v-if="item.data.isUrlIcon" :src="item.data.icon" mode="aspectFit"></image>
							<ali-svg class="app-item-icon" v-if="!item.isUrlIcon" :svg-id="item.data.icon.split(' ')[1]" :icon-theme="item.data.icon.split(' ')[0]" :key="item.data.icon"></ali-svg>
							<text class="app-item-name uni-ellipsis">{{item.data.name}}</text>
						</view>
					</view>
				</drag-cmp>
				<!-- 我的应用 -->
				<scroll-view v-if="!isEdit" :scroll-x="true" class="animation-in" style="line-height: 1;">
					<view class="my-app-box"
						  v-for="item,index in myAppList" 
						  :key="index"
						  @click="openApp(item)">
						<image class="app-item-img my-app" v-if="item.isUrlIcon" :src="item.icon" mode="aspectFit"></image>
						<ali-svg class="my-app" v-if="!item.isUrlIcon" :svg-id="item.icon.split(' ')[1]" :icon-theme="item.icon.split(' ')[0]" :key="item.icon"></ali-svg>
					</view>
				</scroll-view>
				
			</card-cmp>
		</view>

		<!-- 分类导航 -->
		<view class="p-flex-box__flexd tab-nav-box">
			<top-scroll-nav-cmp class="top-nav" :active-index="tabIndex" :tab-data="typeList" title-key="name" @tabClick="changeTab">
			</top-scroll-nav-cmp>
		</view>

		<!-- 分类应用 -->
		<view class="p-flex-box__auto-scrolly tab-body-box">
			<view :class="[
							'app-box',
							tabAnima==2?'animation-left':(tabAnima==3?'animation-right':'animation-in')
						]"
				  v-for="(item,index) in storeAppList" 
				  :key="index">
				<view class="app-item-box" @click="openApp(item)">
					<view class="app-item" :class="{'edit-shadow':isEdit}">
						<i v-if="isEdit"
						    class="fa fa-plus-square del-icon" 
						    :style="{'color':item.canPush?'#26ab2a':'#b3b3b3'}"
						    @click.stop="pushApp(item)">
						</i>
						<image class="app-item-img" v-if="item.isUrlIcon" :src="item.icon" mode="aspectFit"></image>
				
						<ali-svg class="app-item-icon" v-if="!item.isUrlIcon" :svg-id="item.icon.split(' ')[1]" :icon-theme="item.icon.split(' ')[0]" :key="item.icon"></ali-svg>
						<text class="app-item-name uni-ellipsis">{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- <no-more-cmp is-loading="true"></no-more-cmp> -->
			
			<!-- <ali-svg svg-id="icon-anquan" icon-theme="blueAndYellowBorder"></ali-svg> -->
		</view>

	</view>
</template>

<script>
	import noMoreCmp from "../../component/noMoreCmp/index.vue";
	import dragCmp from "../../component/dragCmp/index.vue";
	import topScrollNavCmp from "../../component/topScrollNavCmp/index.vue";
	import cardCmp from '../../component/cardCmp/index.vue';
	import commonUtil from "../../../common/js/commonUtil.js";
	export default {
		components: {
			noMoreCmp,
			dragCmp,
			topScrollNavCmp,
			cardCmp
		},
		data() {
			return {
				
				MAIN_CONFIG: MAIN_CONFIG,

				myAppList: uni.getStorageSync("myAppList") || [],	//我的应用列表
				storeAppList: uni.getStorageSync("latelyAppList") || [],	//分类应用列表

				//分类
				typeList: [
					{
						name: "最近使用",
						appType: ""
					},
					{
						name: "生活应用",
						appType: "1"
					},
					{
						name: "学习应用",
						appType: "2"
					},
					{
						name: "工具应用",
						appType: "3"
					},
					{
						name: "管理应用",
						appType: "5"
					},
					{
						name: "其他应用",
						appType: "4"
					}
				],
				tabIndex: 0, //分类初始下标
				tabAnima:1,  //分类切换样式 1in  2left  3right
				
				isEdit:false //编辑状态
			};
		},
		
		onLoad() {
			this.initData();
		},
		
		methods: {
			
			/* 处理可加入应用 */
			initData(){
				this.storeAppList.forEach(item=>{
					let app = this.myAppList.find(i=>{
						return i.appId == item.appId
					})
					item.canPush = app?false:true
				})
			},

			/* drag编辑返回数据 */
			dragChange(e) {
				this.myAppList = e;
			},

			/* drage编辑删除 */
			dragItemDel(index) {
				this.myAppList.splice(index, 1);
				this.initData();
			},

			/* 应用分类切换 */
			changeTab(item, index) {
				
				//动画处理
				if(index>this.tabIndex){
					this.tabAnima = 2;
				}else if(index<this.tabIndex){
					this.tabAnima = 3;
				}else{
					this.tabAnima = 1;
				}
				
				this.tabIndex = index;
				
				this.appListFilter(item);
				
			},
			
			/* 应用分类过滤 */
			appListFilter(item){
				//我的首页应用
				this.storeAppList = [];
				if(item.appType){
					uni.getStorageSync("storeAppList").forEach(i=>{
						if(i.appType == item.appType){
							this.storeAppList.push(i);
						};
					})
				}else{
					this.storeAppList = uni.getStorageSync("latelyAppList") || [];
				}
				this.initData();
			},
			
			/* 记录最近使用 */
			setLatelyApp(appInfo){
				let arr = uni.getStorageSync("latelyAppList") || [];
				let app = arr.find((item)=>{
					return item.appId == appInfo.appId;
				})
				if(!app){
					if(arr.length<10){
						arr.unshift(appInfo);
					}else{
						arr.shift();
						arr.unshift(appInfo);
					}
				}
				uni.setStorageSync("latelyAppList",arr);
			},
			
			/* 打开应用 */
			openApp(appInfo){
				if(this.isEdit){
					return;
				}
				this.$openApp(appInfo.appId);
				this.setLatelyApp(appInfo);
			},
			
			/* 添加我的应用 */
			pushApp(appInfo){
				if(this.myAppList.length<10&&appInfo.canPush){
					this.myAppList.push(appInfo);
				}
				this.initData();
			},
			
			/* 编辑和完成 */
			edit(){
				
				if(!this.isEdit){
					this.isEdit = true;
					console.log("开始编辑")
				}else{
					let arr = [];
					this.myAppList.forEach((item,index)=>{
						arr.push({
							appId:item.appId,
							sep:index+1
						})
					})
					
					//编辑完成后请求.then
					uni.setStorageSync("myAppList",this.myAppList);
					this.isEdit = false;
					
					console.log("编辑完成")
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.app-store {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.drag-box{
		background: #fff;
	}

	.my-app-box{
		width: 40px;
		height: 40px;
		display: inline-block;
		position: relative;
		
		.my-app{
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	}

	.tab-nav-box{
		margin-top: 10px;
	}

	.tab-body-box{
		background: #fff;
	}
	
	.app-box{
		width: 20%;
		float: left;
		padding: 0.5em;
		box-sizing: border-box;
	}
	
	.app-item-box {
		padding-bottom: 100%;
		position: relative;
	}

	.app-item {
		height: 100%;
		width: 100%;
		position: absolute;
		top: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border-radius: 5px;
		box-sizing: border-box;
		color: rgba(0,0,0,0.8);
	}
	
	.edit-shadow{
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
	}

	.app-item-img {
		width: 40%;
		height: 40%;
		margin: auto;
	}

	.app-item-icon {
		margin:0 auto;
	}

	.app-item-name {
		font-size: 10px;
	}

	.del-icon {
		position: absolute;
		top: 0;
		right: 0;
		color: #dd524d;
	}
</style>
