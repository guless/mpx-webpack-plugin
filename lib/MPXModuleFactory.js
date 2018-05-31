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
        const resolveOptions = data.resolveOptions;
        const request = dependency.request;
        
        this.getResolver(resolveOptions).resolve(
            contextInfo, 
            context, 
            request, 
            {},
            ( err, resources, resourceResolveData ) => {
                if ( err ) callback(err);
                const files = resourceResolveData && resourceResolveData.files;

                
                console.log("platform:", this.platform);
                console.log("files:", files);
                
                
                // callback(new Error("xxx"));
                
                // console.log("=> resources:", resources);
                // console.log("=> resourceResolveData:", resourceResolveData);
                
                // callback();
            }
        );
    }
    
    getResolver( resolveOptions ) {
        return this.resolverFactory.get(
            "miniprogram", 
            Object.assign({ "miniprogram": true }, resolveOptions)
        );
    }
}