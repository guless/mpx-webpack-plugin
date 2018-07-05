const { ConcatSource } = require("webpack-sources");

const PLUGIN_NAME = "MPXChunkTemplatePlugin";

module.exports = class MPXChunkTemplatePlugin {
    apply( chunkTemplate ) {
        chunkTemplate.hooks.render.tap(PLUGIN_NAME, ( modules, chunk ) => {
            const source = new ConcatSource();
            const jsonpFunction = chunkTemplate.outputOptions.jsonpFunction;
            
            source.add(`(function( context ) { `);
            source.add(`if ( context && context[${JSON.stringify(jsonpFunction)}] ) { `);
            source.add(`context[${JSON.stringify(jsonpFunction)}](${JSON.stringify(chunk.ids)},`);
            source.add(modules);
            
            const entries = [chunk.entryModule].filter(Boolean).map(m => m.id);
            
            if ( entries.length > 0 ) {
                source.add(`,${JSON.stringify(entries)}`);
            }
            
            source.add(`)`);
            source.add(`}`);
            source.add(`})((typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this) || (new Function("return this"))())`);
            
            return source;
        });
        
        chunkTemplate.hooks.hash.tap(PLUGIN_NAME, ( hash ) => {
			hash.update(PLUGIN_NAME);
			hash.update(`4`);
			hash.update(`${chunkTemplate.outputOptions.jsonpFunction}`);
			hash.update(`${chunkTemplate.outputOptions.globalObject}`);
		});
    }
}