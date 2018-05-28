>⚠️注意：该插件仅支持 webpack@4.0 以上的版本。

>⚠️注意：该插件仅为使用原生小程序平台提供功能做 webpack 编译支持，因此不提供任何 `组件(component)`、`虚拟DOM(Visual DOM)`支持。如果你喜欢 `VUE` 的开发模式，建议使用 [mpvue](https://github.com/Meituan-Dianping/mpvue) 等其他框架进行开发。

其他类似的项目
------------
- [**mpvue**](https://github.com/Meituan-Dianping/mpvue) - 基于 Vue.js 的小程序开发框架，从底层支持 Vue.js 语法和构建工具体系。
- [**wepy**](https://github.com/Tencent/wepy) - 小程序组件化开发框架。类 vue 风格，已经被官方(Tencent)收编。
- [**wxapp-webpack-plugin**](https://github.com/Cap32/wxapp-webpack-plugin) - 📦 微信小程序 webpack 插件。也是单纯的 webpack 编译支持。


起步
----
```
npm i webpack webpack-cli --save-dev
npm i mpx-webpack-plugin --save-dev
```

配置 webpack.config.js
---------------------
**单个平台的 webpack 配置文件**
```js
const MPXPlugin = require("mpx-webpack-plugin");
const path = require("path");

module.exports = {
    "context": __dirname,
    "entry": "./src/app", // 具体如何配置入口点，请参考下面的【入口点(entry-points)说明】。
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "[name].js"
    },
    
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
};
```
**多个平台的 webpack 配置文件**
```js
const MPXPlugin = require("mpx-webpack-plugin");
const path = require("path");

module.exports = [
    {
        "context": __dirname,
        "entry": "./src/app", // 具体如何配置入口点，请参考下面的【入口点(entry-points)说明】。
        "output": {
            "path": path.resolve(__dirname, "./dist/wechat/"),
            "filename": "[name].js"
        },
        
        "plugins": [
            new MPXPlugin({ "platform": "wechat" })
        ]
    },
    {
        "context": __dirname,
        "entry": "./src/app", // 具体如何配置入口点，请参考下面的【入口点(entry-points)说明】。
        "output": {
            "path": path.resolve(__dirname, "./dist/alipay/"),
            "filename": "[name].js"
        },
        
        "plugins": [
            new MPXPlugin({ "platform": "alipay" })
        ]
    },
    {
        "context": __dirname,
        "entry": "./src/app", // 具体如何配置入口点，请参考下面的【入口点(entry-points)说明】。
        "output": {
            "path": path.resolve(__dirname, "./dist/baidu/"),
            "filename": "[name].js"
        },
        
        "plugins": [
            new MPXPlugin({ "platform": "baidu" })
        ]
    }
];
```

### 入口点(entry-points)说明
定义小程序入口点(entry-points)可以通过以下 3 种配置方式：

- [单一入口点语法(Single Entry Syntax)](https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax)
  - 语法：`entry: string|Array<string>`
  - 示例(1)：`entry: "./src/app"`
  - 示例(2)：`entry: ["./src/app"]`
  
- [对象语法(Object Syntax)](https://webpack.js.org/concepts/entry-points/#object-syntax)
  - 语法：`entry: {[entryChunkName: string]: string|Array<string>}`
  - 示例(1)：`entry: { "app": "./src/app" }`
  - 示例(2)：`entry: { "app": ["./src/app"] }`
  - 说明：使用对象语法(Object Syntax)时 `entryChunkName` 必须使用 `"app"`，因为小程序平台默认找名为 `"app"` 的文件作为应用程序入口点。
  
- [动态入口点语法(Dynamic Syntax)](https://webpack.js.org/configuration/entry-context/#dynamic-entry)
  - 语法：`entry: () => (Single Entry Syntax)|(Object Syntax)|Promise<(Single Entry Syntax)|(Object Syntax)>`
  - 示例(1)：`entry: () => "./src/app"`
  - 示例(2)：`entry: () => ["./src/app"]`
  - 示例(3)：`entry: () => ({ "app": "./src/app" })`
  - 示例(4)：`entry: () => Promise.resolve("./src/app")`
  - 示例(5)：`entry: () => Promise.resolve({ "app": "./src/app" })`
  
### 文件匹配规则
一个小程序的应用程序(application)、页面(page)、组件(component)通常由多个文件组成(wxml|swan|axml, css, js, json)。为了方便开发人员定义文件引用插件提供文件匹配功能来自动匹配相关的应用程序、页面、组件等文件。

- 1，**完全匹配文件。**
  - 示例：`"./src/app.js"`
  - 说明：仅包含 `./src/app.js` 一个文件。
  
- 2，**仅匹配文件名称(忽略后缀名）。**
  - 示例：`"./src/app"`
  - 说明：包含 `src` 目录下所有名为 `app.*` 的文件。
  
- 3，**匹配目录中的文件(不会递归子目录，必须以反斜杠(`/`)结尾）。**
  - 示例：`"./src/"`
  - 说明：包含 `src` 目录下的所有文件。
  
- 4，**[glob](https://github.com/isaacs/node-glob) 搜索模式。**
  - 示例：`"./src/**/*"`
  - 说明：包含 `src` 以及其子目录中的所有文件。
  
假设我们有这样的目录结构：

```
|- <src>
|  |- <pages>
|  |  |- index.js
|  |  |- index.wxml
|  |  |- index.json
|  |  |- index.scss
|  |
|  |- app.js
|  |- app.json
|  |- app.scss
|  |- others.js
```

下面这张表列出对应的匹配结果：

 匹配规则            | 文件列表
--------------------|----------------
 `"./src/app.js"`   | "src/app.js"
 `"./src/app"`      | "src/app.js", "src/app.json", "src/app.scss"
 `"./src/"`         | "src/others.js", "src/app.js", "src/app.json", "src/app.scss"
 `"./src/pages/"`   | "pages/index.js", "pages/index.wxml", "pages/index.json", "pages/index.scss"
 `"./src/**/*"`     | <所有文件>

所有的应用程序(application)、页面(page)、以及组件(component)都支持这种文件匹配规则：

**1，指定配置应用程序(application)匹配规则**
```js
/// webpack.config.js
module.exports = {
    ...
    "entry": "./src/app.*" // 使用 glob 匹配应用程序文件。
};
```

**2，指定页面(page)匹配规则**
```js
/// app.json
{
    ...
    "pages": [
        "./pages/index",   // 第一个页面为默认为首页。
        "./pages/**/*",    // 重复的页面会被去除，因此不必担心重复定义。
        "./other-pages/"
    ]
}
```

**3，指定组件(component)匹配规则**
```js
/// page.json
{
    ...
    "usingComponents": {
        "tag-name-1": "../components/custom-component.*",
        "tag-name-2": "../components/custom-component-directory/"
    }
}
```

### 指定特定平台的文件
为了尽可能的在多个平台(platform)之间复用代码，通常我们只会编写一份代码。但是由于各个平台实现之间的差异，可以通过特定平台的名称
作为**文件后缀**来指定该平台下特殊的实现，例如：

```
|- <src>
|  |- app.js
|  |- app.baidu.js
|  |- app.json
|  |- app.scss
```

下面这个表列出了使用 `"./src/app"` 匹配规则所对应平台的文件列表：

 平台名称     | 文件列表
------------|----------------
 `"wechat"` | "src/app.js", "src/app.json", "src/app.scss"
 `"alipay"` | "src/app.js", "src/app.json", "src/app.scss"
 `"baidu"`  | "src/app.baidu.js", "src/app.json", "src/app.scss"


MPXPlugin( options )
--------------------
- `{string} [options.platform="wechat"]` - 指定运行的小程序平台，可选值：`["wechat", "alipay", "baidu"]`。
  - `"wechat"`：微信小程序平台。
  - `"alipay"`：支付宝小程序平台。
  - `"baidu"`：百度小程序平台。
  
  
完整的示例项目
------------
- [mpx-webpack-plugin-examples](./examples)
  