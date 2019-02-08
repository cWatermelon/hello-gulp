# gulp 前端自动化构建工具

## 基于 
* node.js 
* gulp

***
### 使用方法

* 全局安装 gulp-cli
  - npm -g i gulp-cli
* cd gulp
* npm install 或者 cnpm install (针对使用淘宝镜像的用户)
* gulp 输入gulp 开始工作(会先清空build文件夹内的内容)
* 建议安装 nrm 切换npm源

***

### 特点

* browser-sync 保存自动刷新页面 
* js 校验 es6 编译(可以直接使用es6语法书写js)
* sass 编译压缩
* html 压缩
* images 压缩
* 配置了反向代理 解决了ajax跨域的问题
