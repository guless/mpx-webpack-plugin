const { Tapable } = require("tapable");
const RawModule = require("webpack/lib/RawModule");
const MPXMultiModule = require("./MPXMultiModule");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");
const path = require("path");

module.exports = class MPXMultiModuleFactory extends Tapable {
    constructor( resolverFactory ) {
        super();
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
                
                let files = resourceResolveData && resourceResolveData.files;
                let createdModule = this.createModule(files, { dependency, context, contextInfo });
                
                if ( !createdModule ) {
                    return callback(
                        null, 
                        new RawModule(`/* (ignored) */`, `ignored ${context} ${request}`, `${request} (ignored)`)
                    );
                }
                
                return callback(null, createdModule);
            }
        );
    }
    
    getResolver( resolveOptions ) {
        return this.resolverFactory.get(
            "miniprogram", 
            Object.assign({ "miniprogram": true }, resolveOptions)
        );
    }
    
    createModule( files, { dependency, context, contextInfo } ) {
        const dependencies = files.map(item => 
            new MPXSingleEntryDependency(item, path.basename(item))
        );
        
        return new MPXMultiModule(context, dependencies, dependency.name);
    }
}