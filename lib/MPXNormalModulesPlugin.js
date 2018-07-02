const MPXNormalModule = require("./MPXNormalModule");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");

const PLUGIN_NAME = "MPXNormalModulesPlugin";

module.exports = class MPXNormalModulesPlugin {
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            normalModuleFactory.hooks.createModule.tap(PLUGIN_NAME, ( data ) => {
                const dependency = data.dependencies[0];
                
                if ( dependency.constructor === MPXSingleEntryDependency ) {
                    return new MPXNormalModule(Object.assign(data, { "metadata": dependency.metadata, "name": dependency.name }));
                }
            });
        });
    }
}