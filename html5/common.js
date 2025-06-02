// 选择所有类名为 "qq-panel" 的卡片元素（返回 NodeList 集合）
const panels = document.querySelectorAll('.qq-panel');

// 遍历所有卡片元素，为每个卡片绑定点击事件
panels.forEach(panel => {
    // 注释：JS 是事件驱动语言，通过监听事件触发逻辑
    // 为当前卡片添加点击事件监听器（用户点击卡片时触发）
    panel.addEventListener('click', () => {
        // 调试用日志：点击时在控制台输出 "biubiu"（可删除）
        console.log('biubiu');
        
        // 调用自定义函数：移除所有卡片的激活类（确保只有一个卡片激活）
        removeActiveClasses();
        
        // 为当前被点击的卡片添加激活类（触发 CSS 中 .qq-panel_active 的样式）
        // 注意：此处类名 "qq-panel-active" 与 CSS 中的 ".qq-panel_active" 不一致（下划线 vs 连字符），可能导致样式不生效！
        panel.classList.add("qq-panel_active");
    });
});

// 自定义函数：移除所有卡片的激活类（模块化封装逻辑）
function removeActiveClasses() {
    // 遍历所有卡片元素，逐个移除激活类
    panels.forEach(panel => {
        panel.classList.remove('qq-panel_active'); // 需与 add 时的类名一致
    });
}
    
