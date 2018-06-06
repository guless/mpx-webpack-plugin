原生小程序开发套装(Mini Program X)
-------------------------------

> ⚠️注意：
> - 该插件仅支持 webpack@4.0 以上的版本。
> - 该插件仅为使用原生小程序平台提供功能做 webpack 编译支持，因此不提供 `虚拟DOM(Visual DOM)` 支持。如果你喜欢 `VUE` 的开发模式，建议使用 [mpvue](https://github.com/Meituan-Dianping/mpvue) 等其他框架进行开发。

相关资料
-------
- [**mpx-examples**](./examples) - `mpx-webpack-plugin` 插件示例项目。
- [**mpvue**](https://github.com/Meituan-Dianping/mpvue) - 基于 Vue.js 的小程序开发框架，从底层支持 Vue.js 语法和构建工具体系。
- [**wepy**](https://github.com/Tencent/wepy) - 小程序组件化开发框架。类 vue 风格，已经被官方(Tencent)收编。
- [**wxapp-webpack-plugin**](https://github.com/Cap32/wxapp-webpack-plugin) - 📦 微信小程序 webpack 插件。也是单纯的 webpack 编译支持。

起步
----
```
npm i webpack webpack-cli --save-dev
npm i mpx-webpack-plugin --save-dev
```

配置 npm scripts
----------------
```js
{
    "name": "awesome-miniprogram",
    "version": "1.0.0",
    ...
    "scripts": {
        "watch": "npm run build -- --wacth",             /*< 开发模式 >*/
        "build": "webpack --config=./webpack.config.js"  /*< 生产模式 >*/
    }
}
```

> 小技巧：通过 `webpack --env.*` 可以添加自定的命令行参数，例如：我们可以通过 `webpack --env.target=<production|development>` 来代替以前使用 `cross-env NODE_ENV=<production|development> webpack` 来区分开发环境和生产环境。参考文档：[Environment Variables](https://webpack.js.org/guides/environment-variables/)

配置 webpack.config.js
---------------------
```js
const MPXPlugin = require("mpx-webpack-plugin");
const path = require("path");

module.exports = {
    "context": __dirname,
    "entry": "./src/app", // 具体如何配置入口点，请参考下面的【小程序入口点(Entry-Points)】。
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "[name].js"
    },
    
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
};
```

通过 `webpack.config.js` 导出多份配置文件，可以一次性编译成多个平台的小程序。

```js
const MPXPlugin = require("mpx-webpack-plugin");
const path = require("path");

module.exports = [
    {
        "context": __dirname,
        "entry": "./src/app", // 具体如何配置入口点，请参考下面的【小程序入口点(Entry-Points)】。
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
        "entry": "./src/app", // 具体如何配置入口点，请参考下面的【小程序入口点(Entry-Points)】。
        "output": {
            "path": path.resolve(__dirname, "./dist/baidu/"),
            "filename": "[name].js"
        },
        
        "plugins": [
            new MPXPlugin({ "platform": "baidu" })
        ]
    },
];
```

### 小程序入口点(Entry-Points)
定义小程序入口点可以通过以下 3 种配置方式：

- [单一入口点语法(Single Entry Syntax)](https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax)
  - 格式：`entry: string`
  - 示例：
    ```
    entry: "./src/app"
    ```
  
- [对象语法(Object Syntax)](https://webpack.js.org/concepts/entry-points/#object-syntax)
  - 格式：`entry: {[entryChunkName: string]: string}`
  - 示例：
    ```
    entry: { "app": "./src/app" }
    ```
  
- [动态入口点语法(Dynamic Syntax)](https://webpack.js.org/configuration/entry-context/#dynamic-entry)
  - 格式：`entry: () => (Single Entry Syntax)|(Object Syntax)|Promise<(Single Entry Syntax)|(Object Syntax)>`
  - 示例：
    ```
    entry: () => "./src/app"
    entry: () => ({ "app": "./src/app" })
    entry: () => Promise.resolve("./src/app")
    entry: () => Promise.resolve({ "app": "./src/app" })
    ```
    
>使用对象语法(Object Syntax)指定小程序入口点时，建议使用 `"app"` 作为入口点的名称(entryChunkName)。
 
 MPXPlugin( options )
--------------------

### Options 

 类型      | 名称     | 默认值         | 说明
----------|----------|---------------|--------------------
 {string} | name     | `"app"`       | 指定小程序入口点的名称。如果使用对象语法(Object Syntax)配置 `entry`，则插件通过该字段查找小程序的入口点。
 {string} | platform | `"wechat"`    | 指定运行的小程序平台，可选值：`["wechat", "alipay", "baidu"]`。<ul><li>`"wechat"`：微信小程序。</li><li>`"alipay"`：支付宝小程序。</li><li>`"baidu"`：百度小程序。</li></ul>
  
  
文件解析规则(Resolver)
--------------------