<template>
	<view class="uni-page-body">

		<!-- 顶部分类导航 -->
		<top-scroll-nav-cmp class="top-nav" :active-index="tabIndex" :tab-data="newsTypeList" title-key="newsTypeName"
		 @tabClick="changeTab">
		</top-scroll-nav-cmp>

		<!-- 占位用 -->
		<view style="height: 44px;"></view>

		<!-- swiper dot组件 -->
		<uni-swiper-dot v-if="swiperData.newsSwiperList.length>0" :info="swiperData.newsSwiperList" :current="swiperData.current"
		 field="title" mode="nav">
			<!-- swiper -->
			<swiper circular="true" autoplay="true" @change="changeSwiper">
				<swiper-item v-for="(item,index) in swiperData.newsSwiperList" :key="index" @click="goDetail(item)">
					<image style="width: 100%;" v-if="item.defaultImageUrl" :src="item.defaultImageUrl" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<!-- 新闻列表 -->
		<view class="uni-list" v-if="newsList.length>0">
			<view class="uni-list-cell animation-in" hover-class="uni-list-cell-hover" hover-start-time="0" hover-stay-time="0"
			 v-for="(item, index) in newsList" :key="index" @click="goDetail(item)">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" v-if="item.defaultImageUrl" :src="item.defaultImageUrl" mode="aspectFill"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.title}}</view>
						<view class="uni-media-list-text-bottom">
							<text>来源：{{item.from||"暂无"}}</text>
							<text v-if="item.updateTime">{{item.updateTime | date("YYYY-MM-DD hh:mm")}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 上拉加载UI组件 -->
		<uni-load-more class="animation-in" :status="paginationStatus.hasMore" :size="16" :content-text="paginationStatus.contentText" />

		<!-- 抽屉 -->
		<uni-drawer :visible="isShowDrawer" mode="right" @close="closeDrawer()">
			<view class="-drawer">
				<uni-list class="uni-list">
					<uni-list-item v-for="(item,index) in siteList" :key="index" :title="item.name" @click="changeSite(item)" />
				</uni-list>
			</view>
		</uni-drawer>
		
		<!-- #ifdef MP-WEIXIN -->
		<uni-fab ref="fab" horizontal="right" direction="vertical" :content="fabContent" :pattern="fabStyle" @trigger="fabtTrigger"></uni-fab>
		<!-- #endif -->
	</view>
</template>

<script>
	import topScrollNavCmp from "../../component/topScrollNavCmp/index.vue";
	export default {
		name: "news",
		components: {
			topScrollNavCmp
		},
		data() {
			return {
				fabStyle: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '<!-- @echo ui.themeColor -->',
					buttonColor: '<!-- @echo ui.themeColor -->'
				},

				fabContent: [],

				/* swiper数据 */
				swiperData: {
					newsSwiperList: [],
					current: 0
				},

				/* 主站抽屉状态 */
				isShowDrawer: false,

				/* 主站数据 */
				tabIndex: 0, //顶部分类导航当前下标
				siteList: [],
				siteId: "",

				/* 分类数据 */
				newsTypeId: "",
				newsTypeList: [],

				/* 分页用数据 模板 */
				paginationStatus: {
					offset: 1, //页码
					totalPages: 1, //总页数
					hasMore: "loading", //加载组件状态
					contentText: {
						contentdown: '上拉(๑＞ڡ＜)☆',
						contentrefresh: '加载中(..•˘_˘•..)',
						contentnomore: '没有咯(๑•́ ₃•̀๑)'
					}
				},

				/* 新闻列表 */
				newsList: []
			}
		},



		onLoad() {
			this.init();
		},

		methods: {

			/* 获取主站 */
			init() {
				this.paginationStatus.hasMore = "loading";
				// this.$http({
				// 		url: ""
				// 	})
				// 	.then((res) => {

						this.siteList = [
							{"name":"昨日新闻","siteId":40},
							{"name":"今日新闻","siteId":61}
							];

						this.siteList.forEach((item) => {
							this.fabContent.push({
								text: item.name,
								active: false,
								siteId: item.siteId
							});
						});
						
						this.fabContent[0].active = true;

						this.siteId = this.siteList[0].siteId;
						this.getNewsType();
					// })
			},

			/* 获取分类 */
			getNewsType() {
				this.paginationStatus.hasMore = "loading";
				// this.$http({
				// 		url: "",
				// 		data: {
				// 			"siteId": this.siteId
				// 		}
				// 	})
				// 	.then((res) => {
						this.newsTypeList = [
							{"newsTypeId":4605,"newsTypeName":"内部新闻"},
							{"newsTypeId":4607,"newsTypeName":"外部新闻"}
							];
						this.newsTypeId = this.newsTypeList[0].newsTypeId;
						this.getNewsData(this.siteId, this.newsTypeId)
					// })
			},

			/* 获取列表 */
			getNewsData(siteId, newsType) {
				this.paginationStatus.hasMore = "loading";
				// this.$http({
				// 		url: "",
				// 		data: {
				// 			"siteId": siteId,
				// 			"newsType": newsType,
				// 			"offset": this.paginationStatus.offset
				// 		}
				// 	})
				// 	.then((res) => {
						var res = {
							totalPages:3
						}
						this.newsList.push(...[
							{"content":"","createTime":1486466979000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":[],"isRead":1,"name":null,"newsId":18094,"newsType":38,"parentId":0,"parm":0,"realName":"赵柯宇","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"本报讯 互联网+传统集市，淘宝出现了；互联网+传统银行，支付宝出现了……那么，互联网+教育，会出现什","title":"“互联网 +教育” 开启教育新模式","updateTime":1486466979000,"userId":136305},
							{"content":"","createTime":1486450025000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":[],"isRead":1,"name":null,"newsId":18093,"newsType":38,"parentId":0,"parm":0,"realName":"赵柯宇","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"教育部长陈宝生在2017年全国教育工作会议上所做的工作报告今天在教育部网站刊发。报告全面回顾总结20","title":"2017年，教育部将制定出台这些制度、文件","updateTime":1486450025000,"userId":136305},
							{"content":"","createTime":1484006400000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":["http://mobilecampus.oss.aliyuncs.com/news/lantu/MTv1ycvIMTk4MzgIxA.png"],"isRead":1,"name":null,"newsId":17788,"newsType":38,"parentId":0,"parm":0,"realName":"yq","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"2月25日，兰途大学召开2015科技工作总结暨2016科技工作开局研讨会。会议强调，2016年是“十","title":"兰途大学召开2015科技工作总结","updateTime":1484006400000,"userId":136304},
							{"content":"","createTime":1456738091000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png&a=2&c=3","from":"","imgNameList":["http://www.new1.uestc.edu.cn/upload/image/7fd69c48fa6780c047cd59cbe5b15cfd.jpg?a=2&b=2"],"isRead":1,"name":null,"newsId":4367,"newsType":38,"parentId":0,"parm":0,"realName":"谭永祥","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"日前，接国家自然科学基金委通知，我校2015年申报的《页岩气甜点区岩石力学参数地震叠前反演方法研究》","title":"我校获国家自然科学基金委“石油化工联合基金”重点项目资助","updateTime":1456738091000,"userId":13610},
							{"content":"","createTime":1456738040000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":["http://www.new1.uestc.edu.cn/upload/image/5cfd68cbbd16a47ba223e21d52d72a8c.png"],"isRead":1,"name":null,"newsId":4366,"newsType":38,"parentId":0,"parm":0,"realName":"谭永祥","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"近日，机器人研究中心博士生黄瑞被2016年国际机器人顶级会议IEEE International C","title":"机器人研究中心博士生黄瑞在国际机器人顶级会议ICRA发表论文","updateTime":1456738040000,"userId":13610},
							{"content":"","createTime":null,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"兰途","imgNameList":["http://www.new1.uestc.edu.cn/upload/image/cfda71c5950fe0ce657b91c49fdae91f.jpg"],"isRead":1,"name":null,"newsId":4316,"newsType":38,"parentId":0,"parm":0,"realName":"兰途1","schoolId":0,"seq":0,"sftop":1,"siteId":0,"source":null,"summary":"1月30日，我校艺术团师生赴美国旧金山参加由美国国际文化艺术促进会、美国华人文化艺术联盟联合举办的第","title":"我校艺术团师生在国际比赛再摘一金一银","updateTime":null,"userId":13610},
							{"content":"","createTime":1564012800000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":[],"isRead":1,"name":null,"newsId":55875,"newsType":38,"parentId":0,"parm":0,"realName":"姚耕","schoolId":0,"seq":0,"sftop":0,"siteId":0,"source":null,"summary":"阿凡达发给","title":"啊发发","updateTime":1564061771000,"userId":136751},
							{"content":"","createTime":1496880000000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"中国新闻网","imgNameList":["MC_EDITOR/MC_136/zsvGNcbPzsn3zcAJNg.png"],"isRead":1,"name":null,"newsId":22640,"newsType":38,"parentId":0,"parm":0,"realName":"test13640","schoolId":0,"seq":0,"sftop":0,"siteId":0,"source":null,"summary":"2016年5月，“一会三函”新模式在通州推行，五中通州校区工程在经过北京城市副中心建设领导小组集中审","title":"北京副中心123个建设项目提速 取消奇葩证明129项","updateTime":1496880000000,"userId":1369},
							{"content":"","createTime":1496275200000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":["t_news/161/14962800020561922693946120.JPG"],"isRead":1,"name":null,"newsId":22487,"newsType":38,"parentId":0,"parm":0,"realName":"","schoolId":0,"seq":0,"sftop":0,"siteId":0,"source":null,"summary":"建立手拉手友好学校启动会 5月25日上午，天津市武清区河北屯镇初级中学杨校长、德育许主任、总务兰主任","title":"建立手拉手友好学校启动会","updateTime":1496275200000,"userId":13610},
							{"content":"","createTime":1484870400000,"defaultImageUrl":"http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png","from":"","imgNameList":["http://p1.ifengimg.com/a/2017_06/0d62b83b128db6c_size15_w638_h285.png"]}]);

						if (this.swiperData.newsSwiperList.length == 0 && this.newsList.length > 2) {
							this.swiperData.newsSwiperList = this.newsList.splice(0, 3);
						}

						/* 上拉分页处理 模板 */
						this.paginationStatus.totalPages = res.totalPages;
						

					// })
					// .finally(() => {
						// uni.stopPullDownRefresh();
					// })
			},

			/* 切换分类主站 */
			changeSite(item) {
				if (this.paginationStatus.hasMore == "loading") {
					return;
				}
				this.tabIndex = 0;
				this.newsList = [];
				this.swiperData.newsSwiperList = [];
				this.paginationStatus.offset = 1;
				this.siteId = item.siteId;
				this.getNewsType();
				this.closeDrawer();
			},

			/* 切换新闻分类 */
			changeTab(item, index) {
				if (this.paginationStatus.hasMore == "loading") {
					return;
				}
				this.tabIndex = index;
				this.newsList = [];
				this.swiperData.newsSwiperList = [];
				this.paginationStatus.offset = 1;
				this.newsTypeId = item.newsTypeId;
				this.getNewsData(this.siteId, item.newsTypeId)
			},

			/* 上拉分页处理 模板 */
			onReachBottom() {
				this.paginationStatus.offset++;
				console.log("当前页码:"+this.paginationStatus.offset)
				if (this.paginationStatus.offset > this.paginationStatus.totalPages) {
					this.paginationStatus.offset=this.paginationStatus.totalPages
					this.paginationStatus.hasMore = "noMore";
				} else {
					this.paginationStatus.hasMore = "more";
					this.getNewsData(this.siteId, this.newsTypeId)
				}
				
			},

			/* 下拉刷新 模板 */
			onPullDownRefresh() {
				this.newsList = [];
				this.swiperData.newsSwiperList = [];
				this.paginationStatus.offset = 1;
				this.getNewsData(this.siteId, this.newsTypeId);
			},

			/* swiper改变配合dot组件 */
			changeSwiper(e) {
				this.swiperData.current = e.detail.current;
			},

			/* 进入详情 */
			goDetail(item) {
				this.$routeLink.push({
					url: "/pages/module/news/detail",
					name: "新闻详情",
					params: item
				})
			},

			/* 关闭主站抽屉 */
			closeDrawer() {
				this.isShowDrawer = false
			},

			/* 顶部按钮点击 */
			onNavigationBarButtonTap(e) {
				this.isShowDrawer = !this.isShowDrawer
			},

			// #ifdef MP-WEIXIN
			fabtTrigger(e) {
				this.fabContent.forEach((i) => {
					i.active = false;
				})
				this.fabContent[e.index].active = true;
				this.$forceUpdate();
				this.changeSite(e.item);
			},
			
			onBackPress() {
				if (this.$refs.fab.isShow) {
					this.$refs.fab.close()
					return true
				}
				return false
			}
			// #endif
		}
	}
</script>

<style scoped lang="scss">
	.top-nav {
		position: fixed;
		z-index: 10;
		background: #fff;
		width: 100%;
	}

	.uni-list::before {
		background-color: rgba(0, 0, 0, 0);
	}

	.uni-list:after {
		background-color: rgba(0, 0, 0, 0);
	}

	.uni-list-cell::after {
		height: 0;
		border-top: 1upx solid #f8f8f8;
	}

	.uni-list .uni-list-cell:last-child::after {
		border: none;
	}

	.uni-media-list-logo {
		width: 90px;
		height: 70px;
	}

	.uni-media-list-body {
		height: auto;
		justify-content: space-around;
	}

	.uni-media-list-text-top {
		height: 37px;
		font-size: 14px;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.-drawer {
		height: 100%;
		padding-top: calc(44px + var(--status-bar-height));
	}
</style>
