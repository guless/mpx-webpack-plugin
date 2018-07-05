const MPXPlugin = require("../");
const path = require("path");

module.exports = {
    "mode": "none",
    "target": () => {},
    "context": __dirname,
    "entry": "./src/app",
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "[name].js",
    },
    "optimization": {
        "splitChunks": { 
            "chunks": "all",
            "name": "verdors"
        },
        "runtimeChunk": {
            "name": "runtime"
        },
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
                "test": /\.(html|w?xml|a?xml|swan)(\?.*)?$/i,
                "use": [
                    {
                        "loader": MPXPlugin.loaders.FILE_LOADER,
                        "options": {
                            "name": "[topname].[ext:html]",
                            "context": path.join(__dirname, "src"), 
                            "platform": MPXPlugin.platforms.WECHAT,
                            "exportRelativePath": true,
                        }
                    },
                    { "loader": "extract-loader" },
                    { "loader": "html-loader" },
                ]
            },
            {
                "test": /\.(s?css|wxss|acss)(\?.*)?$/i,
                "use": [
                    { 
                        "loader": MPXPlugin.loaders.FILE_LOADER, 
                        "options": { 
                            "name": "[topname].[ext:css]", 
                            "context": path.join(__dirname, "src"), 
                            "platform": MPXPlugin.platforms.WECHAT,
                            "exportRelativePath": true,
                        } 
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
                        "options": { 
                            "name": "[name]_[hash:6].[ext]", 
                            "publicPath": "/",
                            "context": path.join(__dirname, "src"),
                            "platform": MPXPlugin.platforms.WECHAT
                        } 
                    }
                ] 
            }
        ]
    },
    "plugins": [
        new MPXPlugin({ "platform": MPXPlugin.platforms.WECHAT })
    ]
}