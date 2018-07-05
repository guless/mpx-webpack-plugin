const NodeMainTemplatePlugin = require("webpack/lib/node/NodeMainTemplatePlugin");
const Template = require("webpack/lib/Template");

const PLUGIN_NAME = "MPXMainTemplatePlugin";

module.exports = class MPXMainTemplatePlugin {
    apply( mainTemplate ) {
        new NodeMainTemplatePlugin({ "asyncChunkLoading": false }).apply(mainTemplate);
    }
}