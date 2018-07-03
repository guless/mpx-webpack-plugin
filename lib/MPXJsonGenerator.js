const JsonGenerator = require("webpack/lib/JsonGenerator");
const { RawSource } = require("webpack-sources");
const Template = require("webpack/lib/Template");

module.exports = class MPXJsonGenerator extends JsonGenerator {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    generate( module, dependencyTemplates, runtimeTemplate ) {
        return new RawSource(Template.toComment(`extract json: ${module.name}`));
    }
}