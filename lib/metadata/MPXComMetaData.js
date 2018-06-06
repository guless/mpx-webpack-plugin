const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataType = require("./MPXMetaDataType");

module.exports = class MPXComMetaData extends MPXMetaData {
    constructor( tagname ) {
        super(MPXMetaDataType.APP);
        this.tagname = tagname;
    }
}