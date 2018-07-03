const MPXJsonParser = require("./MPXJsonParser");
const MPXJsonGenerator = require("./MPXJsonGenerator");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");

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
            
            compilation.mainTemplate.hooks.renderManifest.tap(PLUGIN_NAME, ( result, options ) => {
                const chunk = options.chunk;
                const filenameTemplate = `[name].json`;
                const pathOptions = { "contentHashType": "javascript", chunk };
                const identifier = `chunk${chunk.id}:${MPX_JSON_TYPE}`;
                const hash = chunk.hash;
                const manifest = this.renderJsonModule(chunk);
                
                if ( manifest ) {
                    result.push(Object.assign(manifest, { 
                        filenameTemplate,
                        identifier,
                        hash,
                        pathOptions
                    }));
                }
                
                return result;
            });
            
            compilation.chunkTemplate.hooks.renderManifest.tap(PLUGIN_NAME, ( result, options ) => {
                const chunk = options.chunk;
                const filenameTemplate = `[name].json`;
                const pathOptions = { "contentHashType": "javascript", chunk };
                const identifier = `chunk${chunk.id}:${MPX_JSON_TYPE}`;
                const hash = chunk.hash;
                const manifest = this.renderJsonModule(chunk);
                
                if ( manifest ) {
                    result.push(Object.assign(manifest, { 
                        filenameTemplate,
                        identifier,
                        hash,
                        pathOptions
                    }));
                }
                
                return result;
            });
        });
    }
    
    renderJsonModule() {
        
        
        
        
    }
}