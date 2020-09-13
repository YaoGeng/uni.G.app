<template>
	<view class="dragCmp-item-wrap animation-in" :style="{height: itemWrapHeight + 'px'}">
		<view 
			v-for="(item,index) in list" 
			:key="item.data[bindKey] || index" 
			:id="'dragCmp-item' + index" 
			:index="index" 
			:style="{
				'transform': 'translate3d('+ (index === cur ? tranX : item.tranX) +'px,'+ (index === cur ? tranY: item.tranY) +'px,0px)', 
				width: 100 / columns + '%'}"
			:class="[
				'dragCmp-item', cur === index? 'dragCmp-cur':'', 
				curZ === index? 'dragCmp-zIndex':'', 
				animation?'dragCmp-itemTransition':''
			]" 
			@touchstart.stop="longPress($event,item,index)"
			@touchmove.stop="touchMove($event,item,index)" 
			@touchend.stop="touchEnd($event,item,index)">

			<slot 
				:data="item.data" 
				:index="item.key">
			</slot>

		</view>
	</view>
</template>

<script>
	/* 应用中心使用例子 */
	/* 
		<drag-cmp @change="xxx()">
			<slot slot-scope="item">
			</slot>
		</drag-cmp>
		
		change touchend返回排序结果
		
		监听源变化刷新模型，可动态计算组件高度
	 */
	export default {
		name: "dragCmp",
		props: {
			// 数据源
			listData: {
				type: Array,
				value: []
			},
			// 列数
			columns: {
				type: Number,
				default () {
					return 4;
				}
			},
			// 渲染唯一key 如appId 数据唯一值有助于防止重新渲染闪动，能传则传
			bindKey: {
				type: String,
				default () {
					return "";
				}
			}
		},
		data() {
			return {
				item: null,
				cur: -1, // 当前激活的元素
				curZ: -1, // 当前激活的元素, 用于控制激活元素z轴显示
				tranX: 0, // 当前激活元素的 X轴 偏移量
				tranY: 0, // 当前激活元素的 Y轴 偏移量
				olX: 0, // 激活元素起始的 X轴 偏移量
				olY: 0, // 激活元素起始的 Y轴 偏移量
				itemWrapHeight: 0, // 动态计算父级元素高度
				dragging: false, // 是否在拖拽中
				list: [],

				animation: false,

				timePick: null
			}
		},
		watch: {
			listData() {
				this.clearData();
				this.list = this.listData.map((item, index) => {
					let data = {
						key: index,
						data: item
					}
					return data;
				});
				this.setHight()

			},
			columns() {
				this.clearData();
				this.list = this.listData.map((item, index) => {
					let data = {
						key: index,
						data: item
					}
					return data;
				});
				this.setHight()
			}
		},
		created() {
			this.dataChange();
		},
		methods: {

			setHight() {
				uni.createSelectorQuery().select(".dragCmp-item").boundingClientRect((res) => {
console.log(res)
					let rows = Math.ceil(this.list.length / this.columns);
					this.item = res;

					let itemWrapHeight = rows * res.height;
					this.itemWrapHeight = itemWrapHeight;
					
					uni.createSelectorQuery().select(".dragCmp-item-wrap").boundingClientRect((res) => {
						this.itemWrap = res;
					}).exec();
					this.getPosition(this.list, false);
				}).exec();
			},

			dataChange() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.clearData();
				this.init()
			},

			/**
			 * 长按触发移动排序
			 */
			longPress(e, item, index) {
				this.animation = true;
				// 防止多指触发 drag 动作, 如果已经在 drag 中则返回, touchstart 事件中有效果
				if (this.dragging) return;
				// 存储初始化触摸点信息
				this.startTouch = e.changedTouches[0];

				// 如果未获取到触摸点信息 return
				if (!this.startTouch) return;

				this.timePick = setTimeout(() => {
					// 表示 drag 动作开始
					this.dragging = true;
					// 获取初始化点的 pageX 和 pageY
					let {
						pageX: startPageX,
						pageY: startPageY
					} = this.startTouch;
					if (this.columns === 1) { // 单列时候X轴初始不做位移
						this.tranX = 0;
					} else { // 多列的时候计算X轴初始位移, 使 item 水平中心移动到点击处
						this.tranX = startPageX - this.item.width / 2 - this.itemWrap.left;
					}
					// 计算Y轴初始位移, 使 item 垂直中心移动到点击处
					this.tranY = startPageY - this.item.height / 2 - this.itemWrap.top;
					this.cur = index;
					this.curZ = index;
					this.olX = this.tranX;
					this.olY = this.tranY;
					uni.vibrateShort();
				}, 500)

			},
			touchMove(e, item, index) {
				let currentTouch = e.changedTouches[0];
				// 如果未获取到触摸点信息 return
				if (!currentTouch) return;

				// 获取初始化点的 pageX , pageY 以及标示符 identifier
				let {
					pageX: startPageX,
					pageY: startPageY,
					identifier: startId
				} = this.startTouch;
				let {
					pageX: currentPageX,
					pageY: currentPageY,
					identifier: currentId,
					clientY: currentClientY
				} = currentTouch;

				//触摸开始前移动了返回
				if (!this.dragging) {
					if (startPageX != currentPageX || startPageY != currentPageY) {
						clearTimeout(this.timePick);
						return;
					};
					return;
				}

				// 如果不是同一个触发点则返回
				if (startId != currentId) return;
				// 通过 当前坐标点, 初始坐标点, 初始偏移量 来计算当前偏移量
				let tranX = currentPageX - startPageX + this.olX,
					tranY = currentPageY - startPageY + this.olY;
				// 单列时候X轴初始不做位移
				if (this.columns === 1) tranX = 0;

				// 设置当前偏移量
				this.tranX = tranX;
				this.tranY = tranY;
				// 获取当前的起始坐标
				let originKey = item.key;
				// 根据偏移量计算得出目标坐标
				let endKey = this.calculateMoving(tranX, tranY);

				// 防止拖拽过程中发生乱序问题
				if (originKey == endKey || this.originKey == originKey) return;
				this.originKey = originKey;
				// 触发排序
				this.insert(originKey, endKey);
			},

			touchEnd() {

				clearTimeout(this.timePick);
				if (!this.dragging) return;
				this.clearData();
				let listData = [];
				this.list.forEach((item) => {
					listData[item.key] = item.data
				});
				this.$emit('change', listData);
				this.animation = false;
			},

			/**
			 * 清除参数
			 */
			clearData() {
				this.originKey = -1;
				this.dragging = false;
				this.cur = -1;
				this.tranX = 0;
				this.tranY = 0;
				this.curZ = -1;
			},

			/**
			 * 根据排序后 list 数据进行位移计算
			 */
			getPosition(data, vibrate = true) {
				let list = data.map((item, index) => {

					item.tranX = this.item.width * (item.key % this.columns);
					item.tranY = Math.floor(item.key / this.columns) * this.item.height;
					return item
				});
				this.list = list;
			},

			/**
			 * 根据起始key和目标key去重新计算每一项的新的key
			 */
			insert(origin, end) {

				let list;
				if (origin < end) { // 正序拖动
					list = this.list.map((item) => {

						if (item.key > origin && item.key <= end) {
							item.key = item.key - 1;
						} else if (item.key == origin) {
							item.key = end;
						}
						return item
					});
					this.getPosition(list);
				} else if (origin > end) { // 倒序拖动
					list = this.list.map((item) => {

						if (item.key >= end && item.key < origin) {
							item.key = item.key + 1;
						} else if (item.key == origin) {
							item.key = end;
						}
						return item
					});
					this.getPosition(list);
				}
			},

			/**
			 * 根据当前的手指偏移量计算目标key
			 */
			calculateMoving(tranX, tranY) {
				let rows = Math.ceil(this.list.length / this.columns) - 1,
					i = Math.round(tranX / this.item.width),
					j = Math.round(tranY / this.item.height);
				i = i > (this.columns - 1) ? (this.columns - 1) : i;
				i = i < 0 ? 0 : i;
				j = j < 0 ? 0 : j;
				j = j > rows ? rows : j;
				let endKey = i + this.columns * j;
				endKey = endKey >= this.list.length ? this.list.length - 1 : endKey;
				return endKey
			},

			init() {
				// 遍历数据源增加扩展项, 以用作排序使用
				let list = this.listData.map((item, index) => {
					let data = {
						key: index,
						tranX: 0,
						tranY: 0,
						data: item
					}
					return data;
				});
				this.list = list;

				let {
					windowWidth,
					windowHeight,
					platform
				} = uni.getSystemInfoSync();
				this.windowHeight = windowHeight;
				this.platform = platform;

				setTimeout(() => {
					this.setHight()
				},50);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.dragCmp-item-wrap {
		position: relative;
		overflow: hidden;

		.dragCmp-item {
			position: absolute;
			width: 100%;
			z-index: 1;
			padding: 0.5em;
			box-sizing: border-box;

			&.dragCmp-itemTransition {
				transition: transform 0.3s;
			}

			&.dragCmp-zIndex {
				z-index: 99;
			}

			&.dragCmp-cur {
				transition: initial;
			}


		}
	}
</style>
