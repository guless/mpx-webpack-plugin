const NodeSourcePlugin = require("webpack/lib/node/NodeSourcePlugin");
const FunctionModulePlugin = require("webpack/lib/FunctionModulePlugin");
const LoaderTargetPlugin = require("webpack/lib/LoaderTargetPlugin");
const MPXTemplatePlugin = require("./MPXTemplatePlugin");
// const NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
// const JsonpTemplatePlugin = require("webpack/lib/web/JsonpTemplatePlugin");

const PLUGIN_NAME = "MPXTargetPlugin";

module.exports = class MPXTargetPlugin {
    apply( compiler ) {
        const options = compiler.options;
        
        options.target = () => {
            new MPXTemplatePlugin().apply(compiler);
            new FunctionModulePlugin().apply(compiler);
            new NodeSourcePlugin(options.node).apply(compiler);
            new LoaderTargetPlugin("node").apply(compiler);
        };
    }
}