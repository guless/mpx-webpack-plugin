const { Tapable, SyncBailHook, SyncWaterfallHook } = require("tapable");
const RawModule = require("webpack/lib/RawModule");
const MPXMultiModule = require("./MPXMultiModule");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");
const path = require("path");

module.exports = class MPXMultiModuleFactory extends Tapable {
    constructor( resolverFactory ) {
        super();
        this.resolverFactory = resolverFactory;
        this.hooks = {
            resolvedData: new SyncWaterfallHook(["data"]),
            createModule: new SyncBailHook(["data"]),
        };
    }
    
    create( data, callback ) {
        const dependency = data.dependencies[0];
        const context = data.context;
        const contextInfo = data.contextInfo;
        const resolveOptions = data.resolveOptions || {};
        const request = dependency.request;
        
        this.resolverFactory.get("miniprogram", resolveOptions).resolve(
            contextInfo, 
            context, 
            request, 
            {},
            ( err, resource, resourceResolveData ) => {
                if ( err ) return callback(err);
                resourceResolveData = this.hooks.resolvedData.call(resourceResolveData);
                
                if ( !resourceResolveData || !resourceResolveData.miniprogramData ) {
                    return callback(
                        new Error(resource + " doesn't exist or is not a miniprogram entry")
                    );
                }
                
                const createdModule = this.hooks.createModule.call({ dependency, context, contextInfo, resourceResolveData });
                
                if ( !createdModule ) {
                    const { files, name, context } = resourceResolveData.miniprogramData;
                    
                    return callback(
                        null, 
                        new MPXMultiModule({
                            "context": context,
                            "request": path.join(context, name),
                            "metadata": dependency.metadata,
                            "dependencies": files.map(item => new MPXSingleEntryDependency("./" + item, item, dependency.metadata))
                        })
                    );
                }
                
                return callback(null, createdModule);
            }
        );
    }
}