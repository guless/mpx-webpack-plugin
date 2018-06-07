const MPXNormalModule = require("./MPXNormalModule");

const PLUGIN_NAME = "MPXNormalModulesPlugin";

module.exports = class MPXNormalModulesPlugin {
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            normalModuleFactory.hooks.createModule.tap(PLUGIN_NAME, ( data ) => {
                const dependency = data.dependencies[0];
                
                if ( /^miniprogram/i.test(dependency.type || "") ) {
                    return new MPXNormalModule(Object.assign({ "metadata": dependency.metadata }, data));
                }
            });
        });
    }
}