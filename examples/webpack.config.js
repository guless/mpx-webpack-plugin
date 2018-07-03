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
                "test": /\.(?:png|jpe?g|gif|webp)(\?.*)?$/i, 
                "use": [
                    { 
                        "loader": "file-loader",
                        "options": { 
                            "name": "[path][name]_[hash:6].[ext]",
                            "context": path.join(__dirname, "src") 
                        } 
                    }
                ] 
            }
        ]
    },
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
}