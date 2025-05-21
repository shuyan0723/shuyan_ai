// 监听弹出窗口 DOM 加载完成事件
document.addEventListener('DOMContentLoaded', function() {
    // 获取按钮元素
    const changeColorButton = document.getElementById('changeColorButton');
    
    // 按钮点击事件监听
    changeColorButton.addEventListener('click', function() {
        // 查询当前活动窗口中的活动标签页
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            // 在目标标签页执行脚本，修改背景颜色
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },  // 指定目标标签页 ID
                function: () => {
                    document.body.style.backgroundColor = 'green';  // 背景色设为绿色
                }
            });
        });
    });
});