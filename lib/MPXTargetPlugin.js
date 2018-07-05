const NodeSourcePlugin = require("webpack/lib/node/NodeSourcePlugin");
const NodeTemplatePlugin = require("webpack/lib/node/NodeTemplatePlugin");
const ReadFileCompileWasmTemplatePlugin = require("webpack/lib/node/ReadFileCompileWasmTemplatePlugin");
const FunctionModulePlugin = require("webpack/lib/FunctionModulePlugin");
const LoaderTargetPlugin = require("webpack/lib/LoaderTargetPlugin");

const PLUGIN_NAME = "MPXTargetPlugin";

module.exports = class MPXTargetPlugin {
    apply( compiler ) {
        const options = compiler.options;
        
        options.target = () => {
            new NodeTemplatePlugin({ "asyncChunkLoading": false }).apply(compiler);
            new ReadFileCompileWasmTemplatePlugin().apply(compiler);
            new FunctionModulePlugin().apply(compiler);
            new NodeSourcePlugin(options.node).apply(compiler);
            new LoaderTargetPlugin("node").apply(compiler);
        };
    }
}