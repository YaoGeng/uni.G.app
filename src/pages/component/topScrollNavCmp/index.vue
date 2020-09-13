<template>
	<view class="tab-box" id="tab-box" v-if="tabList.length > 0">
		<view class="horizontal">
			<scroll-view :scroll-x="true" style="white-space: nowrap; display: flex;" scroll-with-animation :scroll-left="slider.scrollLeft">
				<block v-for="(item, index) in tabList" :key="index">
					<view class="item animation-in" :class="{ active: activeIndex === index }" :id="'tab_'+index" @click="tabClick(item, index)">{{item[titleKey]}}</view>
				</block>
				<view class="underline" :style="'transform:translateX(' + slider.left + 'px);width:' + slider.width + 'px'"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/* 
	 
	 tabData 顶部列表
	 activeIndex 当前下标
	 titleKey 展示字段
	 @tabClick  callback(item, index)
	 
	 */
	export default {
		name: 'topScrollNavCmp',
		props: {
			tabData: {
				type: Array,
				default: () => []
			},
			activeIndex: {
				type: Number,
				default: 0
			},
			titleKey: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				tabList: [],
				tabListSlider: [],
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				underLinePadding: 15,
				show:false
			};
		},
		watch: {
			tabData(value) {
				this.slider = {
					left: 0,
					width: 0,
					scrollLeft: 0,
				}
				setTimeout(()=>{
					this.tabList = value;
					setTimeout(() => {
						this.updateTabWidth();
					},100);
				},300)
			},
		},
		mounted() {
			this.tabList = this.tabData;
			setTimeout(()=>{
				this.updateTabWidth();
			},300)
		},
		methods: {

			tabClick(item, index) {
				this.tabToIndex(index);
				this.$emit('tabClick', item, index);
			},

			tabToIndex(index) {
				let _slider = this.tabListSlider[index];
				
				this.slider = {
					left: _slider.left + this.underLinePadding,
					width: _slider.width - this.underLinePadding * 2,
					scrollLeft: _slider.scrollLeft,
				}
			},

			updateTabWidth(index = 0,callback) {
				let data = this.tabList;

				if (data.length == 0) return false;

				const query = uni.createSelectorQuery().in(this);

				query.select('#tab_' + index).boundingClientRect((res) => {
					let _prev_slider = this.tabListSlider[index - 1];
					this.tabListSlider[index] = {
						left: res.left,
						width: res.width,
						scrollLeft: res.left - (_prev_slider ? _prev_slider.width : 0),
					}
				
					
					if (this.activeIndex == index) {
						this.tabToIndex(this.activeIndex);
					}

					index++;
					if (data.length > index) {
						this.updateTabWidth(index);
					}
				}).exec();
			}
		}
	}
</script>

<style lang="less" scoped>
	/deep/.uni-scroll-view::-webkit-scrollbar {  
	  display: none;  
	} 
	

	.tab-box {
		width: 100%;
		color: rgba(0, 0, 0, 0.8);
		display: flex;
		height: 44px;
		background: #fff;
		font-size: 14px;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
		overflow: hidden;

		.active {
			color: <!-- @echo ui.themeColor -->;
		}

		.horizontal {
			width: 100%;

			.item {
				display: inline-block;
				text-align: center;
				padding: 0 15px;
				height: 42px;
				line-height: 44px;
			}

			.underline {
				height: 2px;
				background-color: <!-- @echo ui.themeColor -->;
				border-radius: 3px;
				transition: .3s;
			}
		}
	}
</style>
