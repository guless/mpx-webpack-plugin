const JsonGenerator = require("webpack/lib/JsonGenerator");
const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const { RawSource } = require("webpack-sources");
const Template = require("webpack/lib/Template");
const path = require("path");

module.exports = class MPXJsonGenerator extends JsonGenerator {
    constructor( options ) {
        super(options);
        this.options = options;
        this.forceRelative = options.forceRelative === void 0 ? true : !!options.forceRelative;
    }
    
    generate( module, dependencyTemplates, runtimeTemplate, type = "javascript" ) {
        if ( !module.buildInfo.isMerged ) {
            module.buildInfo.isMerged = true;
            
            const data = module.buildInfo.jsonData;
            const metadata = module.metadata;
            const context = path.dirname(module.getChunks()[0].name);
            
            if ( metadata.kind === MPXMetaDataKind.APP ) {
                if ( module.buildInfo.pageDependencies ) {
                    const dependencies = module.buildInfo.pageDependencies;
                    const pages = [];
                    
                    for ( const dependency of dependencies ) {
                        const ref = dependency.getReference();
                        
                        if ( ref && ref.module && !ref.weak ) {
                            const module = ref.module;
                            const chunk = module.getChunks()[0];
                            
                            if ( this.forceRelative ) {
                                pages.push(path.relative(context, chunk.name));
                            }
                            
                            else {
                                pages.push("/" + chunk.name);
                            }
                        }
                    }
                    
                    data.pages = pages;
                }
                
                if ( module.buildInfo.tabbarDependencies ) {
                    if ( !data.tabBar ) { data.tabBar = {}; }
                    if ( !data.tabBar.list ) { data.tabBar.list = []; }
                    
                    const dependencies = module.buildInfo.tabbarDependencies;
                    const list = data.tabBar.list;
                    
                    for ( const dependency of dependencies ) {
                        const ref = dependency.getReference();
                        
                        if ( ref && ref.module && !ref.weak ) {
                            const module = ref.module;
                            const chunk = module.getChunks()[0];
                            const item = (list[dependency.metadata.index] || {});
                            
                            if ( this.forceRelative ) {
                                item.pagePath = path.relative(context, chunk.name);
                            }
                            
                            else {
                                item.pagePath = "/" + chunk.name;
                            }
                        }
                    }
                    
                    data.tabBar.list = list;
                }
            }
            
            else if ( metadata.kind === MPXMetaDataKind.PAGE || metadata.kind === MPXMetaDataKind.COMPONENT ) {
                if ( module.buildInfo.componentDependencies ) {
                    const dependencies = module.buildInfo.componentDependencies;
                    const components = {};
                    
                    for ( const dependency of dependencies ) {
                        const ref = dependency.getReference();
                        const tagname = dependency.metadata.tagname;
                        
                        if ( ref && ref.module && !ref.weak ) {
                            const module = ref.module;
                            const chunk = module.getChunks()[0];
                            
                            if ( this.forceRelative ) {
                                components[tagname] = path.relative(context, chunk.name);
                            }
                            
                            else {
                                components[tagname] = "/" + chunk.name;
                            }
                        }
                    }
                    
                    data.usingComponents = components;
                }
            }
        }
        
        if ( type === "miniprogram/json" ) {
            return new RawSource(JSON.stringify(module.buildInfo.jsonData));
        }
        
        else {
            return new RawSource(
                Template.toNormalComment(`extracted miniprogram json => "${module.name}"`) + "\n" +
                Template.toNormalComment(`${JSON.stringify(module.buildInfo.jsonData, null, 4)}`)
            );
        }
    }
}