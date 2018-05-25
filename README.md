>⚠️注意：该插件仅支持 webpack@4.0 以上的版本。

起步
----
```
npm i webpack webpack-cli --save-dev
npm i mpx-webpack-plugin --save-dev
```

配置 webpack.config.js
---------------------
```js
const MPXPlugin = require("mpx-webpack-plugin");

/// 微信小程序
module.exports = {
    "entry": "./src/app",
    // "entry": { "app": "./src/app" },
    // "entry": () => Promise.resolve({ "app": "./src/app" })
    
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
}
```

MPXPlugin( options )
--------------------
- `{string} options.platform` - 指定小程序平台，可选值：`["wechat", "alipay", "baidu"]`。