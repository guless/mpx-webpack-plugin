const MPXPlugin = require("../");
const path = require("path");

module.exports = {
    "mode": "none",
    "context": __dirname,
    // "entry": "./src/app",
    "entry": () => Promise.resolve({ "app": "./src/app" }),
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "[name].js"
    },
    "plugins": [
        new MPXPlugin({ "platform": "wechat" })
    ]
}