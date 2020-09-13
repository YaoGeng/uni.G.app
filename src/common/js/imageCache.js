import { pathToBase64, base64ToPath } from 'image-tools';

/**
 * uni图片转base64后缓存
 * @param imageUrl (网络地址)
 * @param imageName
 * @param callBack base64字节
 */
function imageUniStorage(imageUrl, imageName, callBack) {
	uni.getStorage({
		key: imageName,
		success: function(res) {
			if (res.data) {
				callBack(res.data);
			} else {
				uni.removeStorage({
					key: imageName,
					success: function() {
						imageUniStorage(imageUrl, imageName, callBack);
					}
				});
			}
		},
		fail: function(res) {
			console.log("读取缓存" + imageName + "失败，重新拉取资源...", res.errMsg);
			netImgToBase64(imageUrl)
				.then((data)=>{
					uni.setStorage({
						key: imageName,
						data: data
					});
					callBack(data);
				})
		}
	});
}

/* 网络图片地址转base64 */
function netImgToBase64(imageUrl){
	return new Promise((resolve, reject) => {
		uni.request({
			url: imageUrl,
			method: 'GET',
			responseType: 'arraybuffer',
			success: res => {
				let base64 = uni.arrayBufferToBase64(res.data);
				base64 = 'data:image/jpeg;base64,' + base64;
				resolve(base64)
			},
			fail: (errMsg)=>{
				console.log(errMsg);
				uni.showToast({
					title: "上传图片失败",
					icon: "none",
					position: 'bottom'
				})
				reject()
			}
		})
	})
	
}

/* 本地、临时图片地址转base64 */
function fileImgToBase64(paths,callBack){
	uni.showToast({
		title: "图片转码中...",
		icon: "none",
		position: 'bottom'
	})
	Promise.all(paths.map(path => pathToBase64(path)))
	  .then(res => {
	    callBack(res)
	  })
	  .catch(error => {
		uni.showToast({
			title: "图片转码失败",
			icon: "none",
			position: 'bottom'
		})
	    console.error(error)
	  })
}



module.exports = {
	imageUniStorage: imageUniStorage,
	netImgToBase64 : netImgToBase64,
	fileImgToBase64:fileImgToBase64
};
