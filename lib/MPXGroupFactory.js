const { Tapable } = require("tapable");
const MPXFinder = require("./MPXFinder");

module.exports = class MPXGroupFactory extends Tapable {
    constructor( platform ) {
        super();
        this.platform = platform;
        this.findersMap = new Map();
        this.hooks = {
            // createFinder:
            // finder
            
            
        };
    }
    
    create( data, callback ) {
        console.log("create group:", data);
    }
    
    getFinder( type ) {
        
        
    }
    
    createFinder( type ) {
        
    }
}