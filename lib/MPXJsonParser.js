const JsonParser = require("webpack/lib/JsonParser");

module.exports = class MPXJsonParser extends JsonParser {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    parse( source, state ) {
        return super.parse(source, state);
    }
}