const MPXPlugin = require("../");
const path = require("path");

module.exports = {
    "mode": "none",
    "context": __dirname,
    "entry": "./src/app",
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "[name].js"
    },
    "module": {
        "rules": [
            {
                "test": /\.json$/i,
                "use": [
                    { "loader": "extract-loader" },
                    { "loader": MPXPlugin.loaders.JSON_LOADER }
                ]
            },
            {
                "test": /\.(s?css|wxss|acss)(\?.*)?$/i,
                "use": [
                    { 
                        "loader": MPXPlugin.loaders.FILE_LOADER, 
                        "options": { "name": "[name].[ext:css]", "platform": "wechat", "context": path.join(__dirname, "src") } 
                    },
                    { "loader": "extract-loader" },
                    { "loader": "css-loader" },
                    { "loader": "sass-loader" },
                ]
            },
            { 
                "test": /\.(?:png|svg|jpe?g|gif|bmp|webp)(\?.*)?$/i, 
                "use": [
                    { 
                        "loader": MPXPlugin.loaders.FILE_LOADER, 
                        "options": { "name": "[name]_[hash:6].[ext]", "platform": "wechat", "context": path.join(__dirname, "src") } 
                    }
                ] 
            }
        ]
    },
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
}