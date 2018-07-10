const PLUGIN_NAME = "MPXLoaderOptionsPlugin";

module.exports = class MPXLoaderOptionsPlugin {
    constructor( platform ) {
        this.platform = platform;
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation ) => {
            compilation.hooks.normalModuleLoader.tap(PLUGIN_NAME, ( context, module ) => {
                context.platform = this.platform;
            });
        });
    }
}