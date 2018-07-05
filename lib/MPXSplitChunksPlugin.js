const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const MPXMultiModule = require("./MPXMultiModule");
const path = require("path");
const getRelativePath = require("./utils/getRelativePath");

const PLUGIN_NAME = "MPXSplitChunksPlugin";

module.exports = class MPXSplitChunksPlugin {
    constructor( options ) {
        options = options || {};
        this.getChunkName = options.getChunkName || this.getChunkName;
        this.outputNodeModules = options.outputNodeModules || "node_modules";
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation ) => {
            compilation.hooks.optimizeChunksBasic.tap(PLUGIN_NAME, ( chunks ) => {
                for ( const chunk of chunks.slice(0) ) {
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
                                const ref = dependency.getReference();
                            
                                if ( !ref || !ref.module || ref.weak ) {
                                    continue;
                                }
                                
                                moduleInfoMap.get(module).add(ref.module);
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
                        
                        for ( const refModule of references ) {
                            chunk.moveModule(refModule, splitChunk);
                        }
                        
                        splitChunk.entryModule = module;
                        splitChunk.name = chunkName;
                    }
                }
            });
        });
    }
    
    getChunkName( request, context ) {
        return getRelativePath(request, context, this.outputNodeModules);
    }
    
    getReferences( module, moduleInfoMap, references ) {
        if ( !references ) {
            references = new Set([module]);
        }
        
        else {
            references.add(module);
        }
        
        const children = moduleInfoMap.get(module);
        
        if ( children ) {
            for ( const item of children ) {
                if ( item instanceof MPXMultiModule ) {
                    continue;
                }
                
                this.getReferences(item, moduleInfoMap, references);
            }
        }
        
        return references;
    }
}