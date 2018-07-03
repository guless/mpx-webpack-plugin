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
                "test": /\.(png|jpe?g|gif|webp)(\?.*)?/i, 
                "use": [
                    { 
                        "loader": "file-loader", 
                        "options": { 
                            "name": "[path][name]_[hash:6].[ext]",
                            "useRelative": true, 
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