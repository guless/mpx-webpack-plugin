const JsonParser = require("webpack/lib/JsonParser");
const MPXMetaDataType = require("./metadata/MPXMetaDataType");
const MPXPageMetaData = require("./metadata/MPXPageMetaData");
const MPXComMetaData = require("./metadata/MPXComMetaData");
const MPXMultiEntryDependency = require("./dependencies/MPXMultiEntryDependency");

const PAGES_KEY = "pages";
const COMPONENTS_KEY = "components";

module.exports = class MPXJsonParser extends JsonParser {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    parse( source, state ) {
        state = super.parse(source, state);
        
        const data = state.module.buildInfo.jsonData;
        const metadata = state.module.metadata;
        
        if ( metadata.type == MPXMetaDataType.APP ) {
            const routes = data.pages;
            
            if ( Array.isArray(routes) ) {
                for ( const request of routes ) {
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
        
        else if ( metadata.type == MPXMetaDataType.PAGE || metadata.type == MPXMetaDataType.COMPONENT ) {
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