# gse-dapp

## Create Project

```
vue init webpack gse-dapp
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

# 一、使用的技术

### 1. 多语言（vue-i18n）

### [https://blog.csdn.net/joyce\_lcy/article/details/78840371](https://blog.csdn.net/joyce_lcy/article/details/78840371)

### 2. 移动端屏幕适配（lib-flexible: 自动将px转化为rem）

### [https://www.cnblogs.com/WQLong/p/7798822.html ](https://www.cnblogs.com/WQLong/p/7798822.html)

### 3. 移动端ui框架（vux）

### [https://doc.vux.li/zh-CN/](https://doc.vux.li/zh-CN/)

### 4. vue的插件（plugin）技术

插件能够提供全局的指令，过滤器，混合，组件和vue实例属性

### 5. 使用vue**状态管理模式（**vuex）

它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化

### 6. 使用Vue Router路由管理器

### [https://router.vuejs.org/](https://router.vuejs.org/)

### 7. 使用vue中的 keep-alive技术

1. keep-alive 会缓存不活动的组件实例，而不是销毁它们
2. 项目中使用`include`属性允许组件有条件地缓存

# 二、目录结构

### 1. api : axios 后端接口请求配置

### 2. config: 全局配置， 常量数据

### 3. gsePlugin: 自定义的vue插件（包括，全局组件，全局对象，全局指令，全局过滤器和全局混合）

### 4. screens: 单页应用的页面（所有页面组件的name必须以screen结尾，以便缓存和销毁处理）

### 5. utils: 辅助工具（如js处理函数, 正则表达式，语言等）

# 二、错误码

### 1. 6打头：设备或功能不可用

### 1. 7打头：调用api反馈不正常数据

### 1. 8打头：程序执行缺少必要数据









###



