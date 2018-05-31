const { Tapable } = require("tapable");


module.exports = class MPXModuleFactory extends Tapable {
    constructor( platform, resolverFactory ) {
        super();
        this.platform = platform;
        this.resolverFactory = resolverFactory;
        this.hooks = {};
    }
    
    create( data, callback ) {
        const dependency = data.dependencies[0];
        const context = data.context;
        const contextInfo = data.contextInfo;
        
        console.log("create:", data);
    }
}