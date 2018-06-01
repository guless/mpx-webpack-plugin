const MPXJsonParser = require("./MPXJsonParser");
const MPXJsonGenerator = require("./MPXJsonGenerator");

const PLUGIN_NAME = "MPXJsonModulesPlugin";
const JSON_TYPE = "miniprogram/json";

module.exports = class MPXJsonModulesPlugin {
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            normalModuleFactory.hooks.afterResolve.tapAsync(PLUGIN_NAME, ( data, callback ) => {
                if ( data.type == "json" ) {
                    const dependency = data.dependencies[0];
                    
                    if ( /^miniprogram/i.test(dependency.type || "") ) {
                        data.parser = normalModuleFactory.getParser(JSON_TYPE, {});
                        data.generator = normalModuleFactory.getGenerator(JSON_TYPE, {});
                    }
                }
                
                return callback(null, data);
            });
            
            normalModuleFactory.hooks.createParser.for(JSON_TYPE).tap(PLUGIN_NAME, ( options ) => {
                return new MPXJsonParser(options);
            });
            
            normalModuleFactory.hooks.createGenerator.for(JSON_TYPE).tap(PLUGIN_NAME, ( options ) => {
                return new MPXJsonGenerator(options);
            });
        });
    }
}