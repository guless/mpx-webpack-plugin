const MPXNormalModule = require("../MPXNormalModule");
const MPXMetaDataKind = require("../metadata/MPXMetaDataKind");
const stringify = require("../utils/stringify");

const PLACE_HOLDER_DELIMITER = ("MPXJsonLoader__delimiter" + Math.random().toString().slice(2));

module.exports = function( content ) {
    if ( this.cacheable ) { this.cacheable(); }
    
    const module = this._module;
    const data = (typeof content == "string" ? JSON.parse(content) : content);
    
    /// 解析小程序配置文件(miniprogram/json)
    if ( (module instanceof MPXNormalModule) ) { 
        const metadata = module.metadata;
        
        /// app.json
        if ( metadata.kind === MPXMetaDataKind.APP ) {
            const list = data.tabBar && data.tabBar.list;
            
            if ( Array.isArray(list) ) {
                for ( const item of list ) {
                    if ( item.iconPath ) { 
                        item.iconPath = `${PLACE_HOLDER_DELIMITER}require('${item.iconPath}')${PLACE_HOLDER_DELIMITER}`; 
                    }
                    
                    if ( item.selectedIconPath ) { 
                        item.selectedIconPath = `${PLACE_HOLDER_DELIMITER}require('${item.selectedIconPath}')${PLACE_HOLDER_DELIMITER}`; 
                    }
                }
            }
        }
    }
    
    const parts = stringify(data).split(PLACE_HOLDER_DELIMITER)
        .map(code => {
            if ( /^require\(/.test(code) ) {
                return code;
            }
            
            else {
                return JSON.stringify(code);
            }
        });
    
    return `module.exports = ${parts.join(" + ")}`;
}