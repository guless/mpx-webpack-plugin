const { Tapable } = require("tapable");

module.exports = class MPXFinder extends Tapable {
    constructor( type, platform ) {
        super();
        this.type = type;
        this.platform = platform;
        this.hooks = {};
    }
    
    search( entries, context, callback ) {
        
        
        
        
    }
}