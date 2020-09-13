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
					<view class="">{{item.title}}</view>
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
				this.$http({
						url: MAIN_CONFIG.serverUrl.httpNews + "news/getSites.do"
					})
					.then((res) => {

						this.siteList = res.siteList;

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
					})
			},

			/* 获取分类 */
			getNewsType() {
				this.paginationStatus.hasMore = "loading";
				this.$http({
						url: MAIN_CONFIG.serverUrl.httpNews + "news/subscribeToNews.do",
						data: {
							"siteId": this.siteId
						}
					})
					.then((res) => {
						this.newsTypeList = res.feedsList.noList || [];
						this.newsTypeId = this.newsTypeList[0].newsTypeId;
						this.getNewsData(this.siteId, this.newsTypeId)
					})
			},

			/* 获取列表 */
			getNewsData(siteId, newsType) {
				this.paginationStatus.hasMore = "loading";
				this.$http({
						url: MAIN_CONFIG.serverUrl.httpNews + "news/getSchoolNews.do",
						data: {
							"siteId": siteId,
							"newsType": newsType,
							"offset": this.paginationStatus.offset
						}
					})
					.then((res) => {
						this.newsList.push(...res.newsList);

						if (this.swiperData.newsSwiperList.length == 0 && this.newsList.length > 2) {
							this.swiperData.newsSwiperList = this.newsList.splice(0, 3);
						}

						/* 上拉分页处理 模板 */
						this.paginationStatus.totalPages = res.totalPages;
						if (this.paginationStatus.offset >= this.paginationStatus.totalPages) {
							this.paginationStatus.offset = res.totalPages;
							this.paginationStatus.hasMore = "noMore";
						} else {
							this.paginationStatus.hasMore = "more";
						}

					})
					.finally(() => {
						uni.stopPullDownRefresh();
					})
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
				this.getNewsData(this.siteId, this.newsTypeId)
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
				this.$routeX.push({
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
