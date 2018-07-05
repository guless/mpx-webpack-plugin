const MPXJsonParser = require("./MPXJsonParser");
const MPXJsonGenerator = require("./MPXJsonGenerator");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");
const MPXMultiModule = require("./MPXMultiModule");

const PLUGIN_NAME = "MPXJsonModulesPlugin";
const JSON_TYPE = "json";
const MPX_JSON_TYPE = "miniprogram/json";

module.exports = class MPXJsonModulesPlugin {
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            normalModuleFactory.hooks.afterResolve.tapAsync(PLUGIN_NAME, ( data, callback ) => {
                if ( data.type == JSON_TYPE ) {
                    const dependency = data.dependencies[0];
                    
                    if ( dependency.constructor === MPXSingleEntryDependency ) {
                        data.type      = MPX_JSON_TYPE;
                        data.parser    = normalModuleFactory.getParser(MPX_JSON_TYPE);
                        data.generator = normalModuleFactory.getGenerator(MPX_JSON_TYPE);
                    }
                }
                
                return callback(null, data);
            });
            
            normalModuleFactory.hooks.createParser.for(MPX_JSON_TYPE).tap(PLUGIN_NAME, ( options ) => {
                return new MPXJsonParser(options);
            });
            
            normalModuleFactory.hooks.createGenerator.for(MPX_JSON_TYPE).tap(PLUGIN_NAME, ( options ) => {
                return new MPXJsonGenerator(options);
            });
            
            compilation.mainTemplate .hooks.renderManifest.tap(PLUGIN_NAME, this.renderJsonManifest.bind(this));
            compilation.chunkTemplate.hooks.renderManifest.tap(PLUGIN_NAME, this.renderJsonManifest.bind(this));
        });
    }
    
    renderJsonManifest( result, options ) {
        const chunk = options.chunk;
        const filenameTemplate = `[name].json`;
        const pathOptions = { "contentHashType": "javascript", chunk };
        const identifier = `chunk${chunk.id}:${MPX_JSON_TYPE}`;
        const hash = chunk.hash;
        const module = this.getJsonModule(chunk);
        const dependencyTemplates = options.dependencyTemplates;
        const moduleTemplates = options.moduleTemplates;
        const runtimeTemplate = moduleTemplates.runtimeTemplate;
        
        if ( module ) {
            result.push({ 
                render: () => {
                    /// 模块发生错误时，不应该继续渲染！
                    if ( !module.error && !module.errors.length ) {
                        return module.source(dependencyTemplates, runtimeTemplate, MPX_JSON_TYPE);
                    }
                },
                filenameTemplate,
                identifier,
                hash,
                pathOptions
            });
        }
        
        return result;
    }
    
    getJsonModule( chunk ) {
        if ( chunk.hasEntryModule() && (chunk.entryModule instanceof MPXMultiModule) ) {
            for ( const dependency of chunk.entryModule.dependencies ) {
                if ( dependency.constructor === MPXSingleEntryDependency ) {
                    const ref = dependency.getReference();
                        
                    if ( !ref || !ref.module || ref.weak ) {
                        continue;
                    }
                    
                    if ( ref.module.type === MPX_JSON_TYPE ) {
                        return ref.module;
                    }
                }
            }
        }
        
        return null;
    }
}