// 配置部分：定义API接口地址和图片路径
// 电影接口地址（获取热门电影，按热度排序，每页1条数据）
const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
// 电影海报图片路径（拼接API返回的相对路径生成完整URL）
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
// 搜索接口地址（拼接用户输入的关键词查询电影）
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

// DOM操作：获取页面中的表单和输入框元素
const oForm  = document.querySelector('#form');  // 通过ID选择器获取表单元素
const oInput = document.querySelector('#search'); // 通过ID选择器获取输入框元素
console.log(oForm); // 打印表单元素（调试用）

// 获取电影数据的核心函数（参数keyword为搜索关键词，无则获取热门电影）
const getMovies = (keyword) => {
  let reqUrl = ''; // 初始化请求URL变量
  if (keyword) {
    // 存在关键词时，使用搜索接口（拼接用户输入的关键词）
    reqUrl = SEARCH_API + keyword;
  } else {
    // 无关键词时，使用热门电影接口
    reqUrl = API_URL;
  }
  // 发送HTTP请求获取电影数据
  fetch(reqUrl)
    .then(res => res.json()) // 将响应的二进制流解析为JSON对象
    .then(data => {
      // 数据获取成功后，调用showMovies函数渲染电影列表
      showMovies(data.results);
    })
}

// 渲染电影列表到页面的函数（参数movies为电影数据数组）
const showMovies = (movies) => {
  const main = document.getElementById('main'); // 获取main容器（原代码未显式声明，需注意）
  main.innerHTML = ''; // 清空main容器的旧内容（避免重复渲染）
  // 使用map遍历电影数组，生成HTML字符串并拼接
  main.innerHTML = movies.map(movie => { 
    // ES6解构赋值：从电影对象中提取需要的字段（海报路径、标题、评分、简介）
    const { poster_path, title, vote_average, overview } = movie;
    // 返回电影卡片的HTML模板（使用模板字符串拼接变量）
    return `
      <div class="movie">
        <img src="${IMG_PATH + poster_path}" alt="${title}"> <!-- 海报图片（拼接完整路径） -->
        <div class="movie-info">
          <h3>${title}</h3> <!-- 电影标题 -->
          <span>${vote_average}</span> <!-- 电影评分 -->
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview} <!-- 电影简介 -->
        </div>
      </div>  
    `;
  }).join(''); // 将map生成的数组转换为字符串（去除数组的逗号分隔符）
}

// 页面加载完成后自动执行的逻辑
window.onload = function() {
  getMovies(); // 页面加载时默认获取热门电影数据
}

// 监听表单的提交事件（用户点击回车或提交按钮时触发）
oForm.addEventListener('submit', function(event) {
  console.log(event, '////'); // 打印事件对象（调试用）
  event.preventDefault(); // 阻止表单的默认提交行为（避免页面跳转）
  const search = oInput.value.trim(); // 获取输入框内容并去除首尾空格
  if (search) {
    // 输入内容有效时，调用getMovies函数搜索电影
    getMovies(search);
  }
})