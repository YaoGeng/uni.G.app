<template>
	<view class="uni-page-body login">
		<!-- 广告 -->
		<start-ad-cmp class="animation-in" :class="{'hideAd':!isShowAd}" :isLogining="isLogining" :isShowAd="isShowAd">
		</start-ad-cmp>

		<!-- 背景 -->
		<image v-if="isShowLogin" class="login-filter-bg animation-in" src="~@/static/aliasStatic/image/login/login_bg.jpg"
		 mode="aspectFill"></image>

		<!-- 登录 -->
		<view class="p-flex-box login-box animation-in" v-if="isShowLogin">
			<!-- logo -->
			<view class="p-flex-box__flex1 logo-box">
				<image class="login-logo" src="/static/aliasStatic/image/login/logo.png" mode="aspectFit">
				</image>
			</view>
			<view class="p-flex-box__flex3">
				<!-- 账号 -->
				<view class="p-flex-box p-flex-box__row input-box">
					<view class="icon-box">
						<i class="fa fa-user-o" aria-hidden="true"></i>
					</view>
					<input class="uni-input" v-model="userName" placeholder="请输入账号" />
				</view>

				<!-- 密ma -->
				<view class="p-flex-box p-flex-box__row input-box">
					<view class="icon-box">
						<i class="fa fa-unlock-alt" aria-hidden="true"></i>
					</view>
					<input class="uni-input" :style="{flex:MAIN_CONFIG.pages.login.hasForgetPWD?'3':'5'}" type="password" placeholder="请输入密码"
					 v-model="password" />
					<view class="forget-PWD" v-if="MAIN_CONFIG.pages.login.hasForgetPWD">
						忘记密码？
					</view>
				</view>

				<!-- 按钮 -->
				<view class="p-flex-box p-flex-box__row p-flex-box__between btn-box">
					<button class="register-btn">注册</button>
					<button class="login-btn" hover-class="login-btn-hover" :loading="isLogining" @click="login()">
						登录
					</button>
				</view>
			</view>
			<view class="agreement-box">
				<text>登录及表示阅读并同意</text>
				<text class="agreement-href">《用户隐私协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	import commonUtil from "../../../common/js/commonUtil.js";
	import imageCache from "../../../common/js/imageCache.js";
	import startAdCmp from "./adCmp.vue";
	export default {
		name: "login",
		components: {
			startAdCmp
		},
		data() {
			return {
				MAIN_CONFIG: MAIN_CONFIG, //config数据
				userName: "", //用户名
				password: "", //mm
				isLogining: false, //登录请求状态
				isShowAd: false, //广告展示状态
				isShowLogin: false,
				loginData: {
					"appInfoList": [{
						"appId": 85, //应用id
						"appSeq": 10, //应用排序
						"appType": 4, //应用类型
						"backbtncon": 0,
						"defaultPage": 1, //所属页
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 1, //集成方式
						"icon": "studyIcon icon-flag", //svg标识
						"integrate": 1, //打开方式
						"name": "投票",
						"version": "1",
						"visitUrl": "https://www.baidu.com/?token={{token}}"
					}, {
						"appId": 10415,
						"appSeq": 5,
						"appType": 1,
						"backbtncon": 1,
						"defaultPage": 2,
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 0,
						"icon": "blueTheme icon-xinwen",
						"integrate": 1,
						"name": "新闻资讯",
						"version": "",
						"visitUrl": "/pages/module/news/index"
					}, {
						"appId": 10416,
						"appSeq": 6,
						"appType": 1,
						"backbtncon": 0,
						"defaultPage": 2,
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 1,
						"icon": "blueTheme icon-diannao",
						"integrate": 2,
						"name": "webView应用",
						"version": "",
						"visitUrl": "https://www.baidu.com"
					}, {
						"appId": 10417,
						"appSeq": 7,
						"appType": 1,
						"backbtncon": 0,
						"defaultPage": 2,
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 4,
						"icon": "blueTheme icon-fuwu",
						"integrate": 2,
						"name": "外部浏览器",
						"version": "",
						"visitUrl": "https://www.baidu.com/"
					}, {
						"appId": 10418,
						"appSeq": 8,
						"appType": 1,
						"backbtncon": 0,
						"defaultPage": 2,
						"downloadUrl": "https://www.baidu.com",
						"downloadUrlIOS": "https://itunes.apple.com/us/app/i-zhong-guo-hai-da/id1173749785?l=zh&ls=1&mt=8",
						"embedType": 0,
						"icon": "blueTheme icon-zhuanti",
						"integrate": 3,
						"name": "三方应用",
						"version": "",
						"visitUrl": null
					}, {
						"appId": 10419,
						"appSeq": 9,
						"appType": 1,
						"backbtncon": 0,
						"defaultPage": 1,
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 1,
						"icon": "studyIcon icon-online",
						"integrate": 2,
						"name": "H5应用",
						"version": "",
						"visitUrl": "https://www.baidu.com"
					}, {
						"appId": 10436,
						"appSeq": 14,
						"appType": 1,
						"backbtncon": 0,
						"defaultPage": 1,
						"downloadUrl": null,
						"downloadUrlIOS": null,
						"embedType": 1,
						"icon": "ltAppStore color-icon_xiaoyuanditu",
						"integrate": 2,
						"name": "地图",
						"version": "",
						"visitUrl": "/hybrid/html/mapTest.html"
					}],
					"token": ["", ""],
					"userBaseInfo": {
						"headImage": "http://seafile.app8848.com/f/20f99108afca4e5680a3/?dl=1&type=png",
						"nickName": "yg",
						"realName": "yg",
						"userId": 35018,
					},
					"userLoginInfo": {
						"phone": "",
						"userId": 35018,
						"userName": "yg",
					}
				}
			}
		},
		created() {
			/* 获取token缓存，成功跳过登录 */
			uni.getStorage({
				key: "token",
				success: (res) => {

					/* 展示广告 */
					this.isShowAd = true;
					this.isShowLogin = false;
					this.skipLogin();

				},
				fail: () => {
					this.isShowAd = false;
					this.isShowLogin = true;
				}
			});
		},

		methods: {

			/* 登录 */
			login() {
				if (!this.userName) {
					uni.showToast({
						title: "请输入账号",
						icon: "none",
						position: 'bottom'
					})
					return;
				}
				if (!this.password) {
					uni.showToast({
						title: "请输入密码",
						icon: "none",
						position: 'bottom'
					})
					return;
				}

				if (this.isLogining) {
					return;
				}

				this.isLogining = true;

				let data = this.loginData
				//登录成功操作.then
				this.setLoginStatus(data);
				uni.switchTab({
					url: '../home/index',
				});

				/* 	//登录失败操作.catch
					this.isShowAd = false;
					this.isShowLogin = true; */

				//登录完成.finally
				this.isLogining = false;

			},

			/* 跳过登录 */
			skipLogin() {
				this.isLogining = true;
				let data = this.loginData
				uni.showLoading({
					title: '登录中',
					mask: true
				});

				//登录成功操作.then
				this.setLoginStatus(data);

				/* //登录失败操作.catch
				uni.clearStorage();
				this.isShowAd = false;
				this.isShowLogin = true; */

				//登录完成.finally
				this.isLogining = false;

			},

			/* 存储用户数据 */
			setLoginStatus(data) {
				/* 缓存token */
				uni.setStorageSync("token", data.token[0] + "_" + data.token[1]);

				/* 头像预处理 */
				imageCache.netImgToBase64(data.userBaseInfo.headImage)
					.then((res) => {
						data.userBaseInfo.headImage = res;
						uni.setStorageSync("loginInfo", data);
					})

				/* 运行时状态信息 */
				uni.setStorageSync("loginInfo", data);

				/* 过滤应用类型 */
				this.$store.commit("login/filterAppList");

				uni.hideLoading();

			},


		}
	}
</script>

<style scoped lang="less">
	uni-page-body {
		height: 100%;
	}

	.login {
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.hideAd {
		display: none;
	}

	.login-filter-bg {
		height: 100vh;
		width: 100%;
	}

	.login-box {
		height: 100%;
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
	}

	.logo-box {
		position: relative;
	}

	.login-logo {
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		height: 60px;
	}

	.input-box {
		width: 80%;
		margin: 0 auto 30px;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 50px;
	}

	.icon-box {
		flex: 1;
		position: relative;

		i {
			font-size: 18px;
			color: <!-- @echo ui.themeColor -->;
			position: absolute;
			top: 50%;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
		}
	}

	.uni-input {
		flex: 5;
		background: transparent;
		color: <!-- @echo ui.themeColor -->;
	}

	.forget-PWD {
		flex: 2;
		font-size: 12px;
		margin: auto;
		padding-right: 6px;
		text-align: right;
		color: #1cb3cc;
	}

	.btn-box {
		width: 80%;
		margin: 0 auto;
	}

	.register-btn,
	.login-btn {
		margin: 0;
		padding-left: 40px;
		padding-right: 40px;
		font-size: 16px;
		border-radius: 50px;

	}

	.register-btn::after {
		border: none;
	}

	.login-btn::after {
		border: none;
	}

	.login-btn {
		background-color: <!-- @echo ui.themeColor -->;
		color: #fff;
	}

	.login-btn-hover {
		color: #ECECEC;
	}

	.agreement-box {
		position: absolute;
		bottom: 25px;
		width: 100%;
		text-align: center;
		color: #fff;
		text-shadow: 0px 0px 10px #333333;
		background: rgba(255, 255, 255, 0.75);

		.agreement-href {
			color: #1a93bb;
		}
	}
</style>
