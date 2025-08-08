// compressWorker.js - Web Worker 图片压缩脚本
// 该 Worker 负责在后台线程中处理图片压缩，不阻塞主线程

// 监听来自主线程的消息
self.onmessage = async function (e) {
    // 解构赋值获取图片数据和压缩质量参数
    const {imgData, quality = 0.8} = e.data;
    
    try {
        // 步骤1: 将 base64 图片数据转换为 Blob 对象
        // fetch API 可以处理 base64 数据并返回响应对象
        // await fetch(imgData) 获取响应对象
        // .blob() 将响应体转换为 Blob 对象
        const blob = await (await fetch(imgData)).blob();
        
        // 步骤2: 将 Blob 对象转换为 ImageBitmap
        // ImageBitmap 是一种高效的位图表示，适合在 Worker 中使用
        const bitmap = await createImageBitmap(blob);
        
        // 步骤3: 创建离屏画布 (OffscreenCanvas) 进行图片处理
        // OffscreenCanvas 允许在 Worker 中进行 Canvas 操作，无需 DOM
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        
        // 获取 2D 绘图上下文
        const ctx = canvas.getContext('2d');
        
        // 在画布上绘制原始图片
        ctx.drawImage(bitmap, 0, 0);
        
        // 步骤4: 将画布内容转换为压缩后的 Blob
        // convertToBlob 方法接受配置对象，可以指定图片类型和压缩质量
        const compressedBlob = await canvas.convertToBlob({
            type: 'image/jpeg',  // 输出为 JPEG 格式
            quality              // 压缩质量 (0.0-1.0)
        });
        
        // 步骤5: 将压缩后的 Blob 转换为 base64 字符串
        const reader = new FileReader();
        reader.onloadend = () => {
            // 发送成功消息和压缩后的图片数据回主线程
            self.postMessage({
                success: true,
                data: reader.result
            });
        };
        // 以 base64 格式读取 Blob
        reader.readAsDataURL(compressedBlob);
    } catch (err) {
        // 错误处理: 发送失败消息和错误信息回主线程
        self.postMessage({
            success: false,
            data: err.message
        });
    }
};
