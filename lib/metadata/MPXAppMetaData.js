const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataKind = require("./MPXMetaDataKind");

module.exports = class MPXAppMetaData extends MPXMetaData {
    constructor( name ) {
        super(MPXMetaDataKind.APP);
        this.name = name;
    }
}