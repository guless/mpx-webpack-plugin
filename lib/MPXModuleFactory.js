const { Tapable } = require("tapable");

module.exports = class MPXModuleFactory extends Tapable {
    constructor( platform ) {
        super();
        this.platform = platform;
        this.hooks = {};
    }
    
    create( data, callback ) {
        console.log("create:", data);
    }
}