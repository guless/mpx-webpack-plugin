const PLUGIN_NAME = "MPXResolverPlugin";

module.exports = class MPXResolverPlugin {
    constructor( platform ) {
        this.platform = platform;
    }
    
    apply( resolver ) {
        console.log("resolver:");
    }
}