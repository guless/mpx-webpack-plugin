const MPXPageMetaData = require("./MPXPageMetaData");

module.exports = class MPXTabbarMetaData extends MPXPageMetaData {
    constructor( index ) {
        super();
        this.index = index;
    }
}