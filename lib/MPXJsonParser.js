const JsonParser = require("webpack/lib/JsonParser");
const PAGES_KEY = "pages";
const COMPONENTS_KEY = "components";

module.exports = class MPXJsonParser extends JsonParser {
    constructor( options ) {
        super(options);
        this.options = options;
    }
    
    parse( source, state ) {
        // console.log("id:", state.module.id
        
        
        
        return super.parse(source, state);
    }
}