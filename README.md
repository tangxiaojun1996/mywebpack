# mywebpack

## 实现一个简易的 webpack

实现要点：

- 提供一个类似 webpack.config.js 的编译配置文件（mywebpack.config.js）
- 实现一个 Compiler，用于获取配置(options)、实例化 Compilation、运行构建(run)；
- 实现一个 Compilation，用于解析文件(run loader)、分析依赖(parse 成 ast)、生成 chunk(seal)；
- 支持以 tapable 为基础的插件化机制；
- 支持配置 loader 解析文件；
- 整体流程和 webpack 编译流程靠拢，大致为：init->run->make->seal->emit ；

> 实现参考：[玩转 webpack](https://time.geekbang.org/course/intro/190) - 第六章 - 动手实现简易的 webpack

## 目录结构

```
|-- mywebpack
    |-- mywebpack.config.js // 类似于webpack.config.js的配置文件
    |-- package.json
    |-- dist                // 打包目录
    |   |-- bundle.js
    |   |-- index.html
    |-- src                 // 业务目录
    |   |-- add.js
    |   |-- index.js
    |-- webpack             // mywebpack的依赖目录
        |-- Compilation.js
        |-- Compiler.js
        |-- EntryPlugin.js
        |-- MyLoader.js
        |-- index.js        // mywebpack的入口文件
```

## 体验方式

```javascript
// 安装依赖
yarn

// 执行打包
node webpack/index.js

```

dist/bundle.js 为打包结果

可在浏览器打开 dist/index.html 查看效果
