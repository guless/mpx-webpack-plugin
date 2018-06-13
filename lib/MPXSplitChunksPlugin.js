const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const MPXMultiModule = require("./MPXMultiModule");
const path = require("path");

const PLUGIN_NAME = "MPXSplitChunksPlugin";

module.exports = class MPXSplitChunksPlugin {
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation ) => {
            compilation.hooks.optimizeChunksBasic.tap(PLUGIN_NAME, ( chunks ) => {
                for ( const chunk of chunks ) {
                    if ( !chunk.hasEntryModule() 
                        || !(chunk.entryModule instanceof MPXMultiModule)
                        || !(chunk.entryModule.metadata.kind === MPXMetaDataKind.APP) ) {
                            
                        continue;
                    }
                    
                    /// 1) 建立模块引用表。
                    const moduleInfoMap = new Map();
                    const willSplitModules = new Set();
                    
                    for ( const module of chunk.modulesIterable ) {
                        if ( (module instanceof MPXMultiModule)
                            && (module.metadata.kind == MPXMetaDataKind.PAGE || module.metadata.kind == MPXMetaDataKind.COMPONENT) ) {
                            
                            willSplitModules.add(module);
                        }
                        
                        if ( !moduleInfoMap.has(module) ) {
                            moduleInfoMap.set(module, new Set());
                            
                            for ( const dependency of module.dependencies ) {
                                const refer = dependency.getReference();
                            
                                if ( !refer || !refer.module || refer.weak ) {
                                    continue;
                                }
                                
                                moduleInfoMap.get(module).add(refer.module);
                            }
                        }
                    }
                    
                    // console.log("willSplitModules:", Array.from(willSplitModules, item => item.request));
                    // console.log("moduleInfoMap:");
                    
                    // for ( const tokens of moduleInfoMap ) {
                    //     console.log("module:", tokens[0].request);
                    //     console.log("dependencies:", Array.from(tokens[1], item => item.request));
                    // }
                    
                    /// 2) 分离模块。
                    const entry = chunk.entryModule;
                    const context = entry.context;
                    
                    for ( const module of willSplitModules ) {
                        const chunkName = this.getChunkName(module.request, context)
                        const splitChunk = compilation.addChunk(chunkName);
                        const references = this.getReferences(module, moduleInfoMap);
                        
                        chunk.moveModule(module, splitChunk);
                        
                        for ( const refModule of references ) {
                            chunk.moveModule(refModule, splitChunk);
                        }
                        
                        chunk.split(splitChunk);
                    }
                }
            });
        });
    }
    
    getChunkName( request, context ) {
        const relative = path.relative(context, request);
        const parts = relative.split(/[\/\\]/);
        
        while( (parts[0] === "." || parts[0] === "..") ) {
            parts.shift();
        }
        
        return parts.filter(Boolean).join("/");
    }
    
    getReferences( module, moduleInfoMap ) {
        const references = new Set();
        
        for ( const ref of moduleInfoMap.get(module) ) {
            references.add(ref);
        }
        
        return references;
    }
}