const JsonParser = require("webpack/lib/JsonParser");
const MPXMetaDataKind = require("./metadata/MPXMetaDataKind");
const MPXPageMetaData = require("./metadata/MPXPageMetaData");
const MPXComMetaData = require("./metadata/MPXComMetaData");
const MPXTabbarMetaData = require("./metadata/MPXTabbarMetaData");
const MPXMultiEntryDependency = require("./dependencies/MPXMultiEntryDependency");
const MPXExternalPluginDependency = require("./dependencies/MPXExternalPluginDependency");

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
                const dependencies = list.map(
                    (item, index) => {
                        return item.pagePath ? new MPXMultiEntryDependency(item.pagePath, new MPXTabbarMetaData(index)) : null
                    }
                ).filter(Boolean);
                
                for ( const dependency of dependencies ) {
                    state.module.addDependency(dependency);
                }
                
                state.module.buildInfo.tabbarDependencies = dependencies;
            }
        }
        
        else if ( metadata.kind == MPXMetaDataKind.PAGE || metadata.kind == MPXMetaDataKind.COMPONENT ) {
            if ( data.usingComponents ) {
                const components = data.usingComponents;
                const dependencies = Object.keys(components).map(tagname => {
                    if ( this.isAbsoluteURL(components[tagname]) ) {
                        return new MPXExternalPluginDependency(components[tagname],  new MPXComMetaData(tagname));
                    }
                    
                    else {
                        return new MPXMultiEntryDependency(components[tagname], new MPXComMetaData(tagname));
                    }
                });
                
                for ( const dependency of dependencies ) {
                    if ( !(dependency instanceof MPXExternalPluginDependency) ) {
                        state.module.addDependency(dependency);
                    }
                }
                
                state.module.buildInfo.componentDependencies = dependencies;
            }
        }
        
        return state;
    }
    
    isAbsoluteURL( url ) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    }
}