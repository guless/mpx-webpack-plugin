const MPXMetaData = require("./MPXMetaData");
const MPXMetaDataType = require("./MPXMetaDataType");

module.exports = class MPXAppMetaData extends MPXMetaData {
    constructor( name ) {
        super(MPXMetaDataType.APP);
        this.name = name;
    }
}