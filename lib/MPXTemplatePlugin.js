const NodeHotUpdateChunkTemplatePlugin = require("webpack/lib/node/NodeHotUpdateChunkTemplatePlugin");
const MPXMainTemplatePlugin = require("./MPXMainTemplatePlugin");
const MPXChunkTemplatePlugin = require("./MPXChunkTemplatePlugin");

const PLUGIN_NAME = "MPXTemplatePlugin";

module.exports = class MPXTemplatePlugin {
    apply( compiler ) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, ( compilation ) => {
            new MPXMainTemplatePlugin(this.asyncChunkLoading).apply(compilation.mainTemplate);
			new MPXChunkTemplatePlugin().apply(compilation.chunkTemplate);
			new NodeHotUpdateChunkTemplatePlugin().apply(compilation.hotUpdateChunkTemplate);
        });
    }
}