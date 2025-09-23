# xss 跨站脚本攻击
XSS 是攻击者把恶意脚本注入到页面中，让浏览器执行。

- 存储型
 - 攻击者把恶意脚本存储到数据库中， 当用户访问页面时，脚本会被浏览器执行。
 - 拿到cookie 发送到攻击者的网站
   Cookie httpOnly 防止xss
 不能相信用户的输入，对用户的输入进行转义
 <script> &lt;script&gt; html转译

- DOM型 输入立即执行
- 反射型 
 http://example.com/search?keyword=<script>alert('XSS')</script> 
 const keyword = new URLSearchParams(location.search).get('keyword');
  document.getElementById('result').innerHTML = 搜到 "${keyword}" 的结果;

- 解决方案
  用textContent 代替innerHTML输入验证;
  过滤或限制特殊字符< > &lt;&gt; 在服务器端对动态内容进行HTML编码
