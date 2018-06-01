const JsonGenerator = require("webpack/lib/JsonGenerator");

module.exports = class MPXJsonGenerator extends JsonGenerator {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    generate( module, dependencyTemplates, runtimeTemplate ) {
        return super.generate(module, dependencyTemplates, runtimeTemplate);
    }
}