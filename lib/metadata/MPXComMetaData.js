const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataKind = require("./MPXMetaDataKind");

module.exports = class MPXComMetaData extends MPXMetaData {
    constructor( tagname ) {
        super(MPXMetaDataKind.COMPONENT);
        this.tagname = tagname;
    }
}