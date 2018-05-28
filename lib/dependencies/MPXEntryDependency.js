const Dependency = require("webpack/lib/Dependency");

module.exports = class MPXEntryDependency extends Dependency {
    constructor( name, entries ) {
        super();
        this.name = name;
        this.entries = entries;
    }
    
    get type() {
        return "mpx entry";
    }
}