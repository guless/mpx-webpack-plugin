const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const MPXMultiModule = require("./MPXMultiModule");
const LoaderUtils = require("loader-utils");
const { ConcatSource } = require("webpack-sources");
const Template = require("webpack/lib/Template");

const PLUGIN_NAME = "MPXLoadChunksPlugin";

module.exports = class MPXLoadChunksPlugin {
    constructor( chunks ) {
        this.chunks = chunks || [];
    }
    
    apply( compiler ) {
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, ( compilation ) => {
            compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, ( modules, chunk ) => {
                if ( !chunk.hasEntryModule() 
                    || !(chunk.entryModule instanceof MPXMultiModule)
                    || !(chunk.entryModule.metadata.kind === MPXMetaDataKind.APP) ) {
                        
                    return;
                }
                
                const source = new ConcatSource(
                    Template.toNormalComment(`MPX_LOAD_CHUNKS_PLUGIN CHUNKS INJECTION`),
                    "\n"
                );
                
                for ( const name of this.chunks ) {
                    source.add(`require(${JSON.stringify(LoaderUtils.urlToRequest(name))});\n`);
                }
                
                source.add("\n");
                source.add(modules);
                source.add(";");
                
                return source;
            });
        });
    }
}