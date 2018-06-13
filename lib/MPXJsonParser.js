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
            const pages = data.pages;
            
            if ( Array.isArray(pages) ) {
                for ( const request of pages ) {
                    state.module.addDependency(new MPXMultiEntryDependency(request, new MPXPageMetaData()));
                }
            }
            
            /**
             * TODO: 解析 `tabBar` 字段。
             * {
             *   "list":[{ "pagePath", "text", "iconPath", "selectedIconPath" }]
             * }
             */
        }
        
        else if ( metadata.kind == MPXMetaDataKind.PAGE || metadata.kind == MPXMetaDataKind.COMPONENT ) {
            const components = data.usingComponents;
            
            if ( (typeof components == "object") && (components !== null) ) {
                for ( const tagname of Object.keys(components) ) {
                    const request = components[tagname];
                    
                    state.module.addDependency(new MPXMultiEntryDependency(request, new MPXComMetaData(tagname)));
                }
            }
        }
        
        return state;
    }
}