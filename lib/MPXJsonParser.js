const JsonParser = require("webpack/lib/JsonParser");
const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const MPXPageMetaData = require("./metadata/MPXPageMetaData");
const MPXComMetaData = require("./metadata/MPXComMetaData");
const MPXMultiEntryDependency = require("./dependencies/MPXMultiEntryDependency");

module.exports = class MPXJsonParser extends JsonParser {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    parse( source, state ) {
        state = super.parse(source, state);
        
        const data = state.module.buildInfo.jsonData;
        const metadata = state.module.metadata;
        
        if ( metadata.kind == MPXMetaDataKind.APP ) {
            if ( data.pages ) {
                const pages = data.pages;
                const dependencies = pages.map(request => new MPXMultiEntryDependency(request, new MPXPageMetaData()));
                
                for ( const dependency of dependencies ) {
                    state.module.addDependency(dependency);
                }
                
                state.module.buildInfo.pageDependencies = dependencies;
            }
            
            if ( data.tabBar && data.tabBar.list ) {
                const list = data.tabBar.list;
                const dependencies = list.map(item => new MPXMultiEntryDependency(item.pagePath, new MPXPageMetaData()));
                
                for ( const dependency of dependencies ) {
                    state.module.addDependency(dependency);
                }
                
                state.module.buildInfo.tabbarDependencies = dependencies;
            }
        }
        
        else if ( metadata.kind == MPXMetaDataKind.PAGE || metadata.kind == MPXMetaDataKind.COMPONENT ) {
            if ( data.usingComponents ) {
                const components = data.usingComponents;
                const dependencies = Object.keys(components).map(tagname => new MPXMultiEntryDependency(components[tagname], new MPXComMetaData(tagname)));
                
                for ( const dependency of dependencies ) {
                    state.module.addDependency(dependency);
                }
                
                state.module.buildInfo.componentDependencies = dependencies;
            }
        }
        
        return state;
    }
}