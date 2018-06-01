const { Tapable } = require("tapable");
const RawModule = require("webpack/lib/RawModule");
const MPXModule = require("./MPXModule");
const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency");
const path = require("path");

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
        const dependencies = this.createDependencies(files);
        return new MPXModule(context, dependencies, dependency.name);
    }
    
    createDependencies( files ) {
        return files.map(item => {
            const dep = new SingleEntryDependency(item);
            dep.loc = "miniprogram:" + (path.extname(item).slice(1));
            return dep;
        });
    }
}