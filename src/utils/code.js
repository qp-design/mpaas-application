import drawQrcode from 'weapp-qrcode'
import upng from 'upng-js'

export const code = (object,cb) => {
    // 方法都是通过canvasId关联在一起的
    // return new Promise((reslove,reject) => {
        const ctx = wx.createCanvasContext(object.canvasId)
        // 使用canvas画出二维码
        drawQrcode({
            width: object.width,
            height: object.height,
            canvasId: object.canvasId,
            text: object.text,
            callback: () => {
                // 把canvas上面的二维码导出通过微信api生成临时路径
                // 此处有坑，wx.canvasToTempFilePath要写在ctx.draw()这个方法里面的回调里面
                // 如果直接按照下面的方法不行的话 ，试着写在回调里面
                wx.canvasToTempFilePath({
                    canvasId: object.canvasId,
                    success(res) {
                        // 把临时路径转化成base64格式
                        wx.canvasGetImageData({
                            canvasId: object.canvasId,
                            x: 0,
                            y: 0,
                            width: object.width,
                            height: object.height,
                            success(res) {
                            // 处理数组，通过这个方法得到的数组，在调用微信apiarrayBufferToBase64
                            // 就可以转化为base64，即后台需要的数据，直接传过去就好了
                                let pngData = upng.encode([res.data.buffer], res.width, res.height)
                                let base64 = wx.arrayBufferToBase64(pngData)
                                cb('data:image/jpeg;base64,' + base64)
                                // resolve(`data:image/jpeg;base64,${base64}`)
                            }
                        })
                    }
                })
            }
        })
    // })
}

