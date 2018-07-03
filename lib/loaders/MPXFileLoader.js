const getRelativePath = require("../utils/getRelativePath");
const LoaderUtils = require("loader-utils");
const stringify = require("../utils/stringify");
const getInterpolateExtname = require("../utils/getInterpolateExtname");
const path = require("path");

module.exports = function( content ) {
    if ( this.cacheable ) { this.cacheable(false); }
    
    const options = LoaderUtils.getOptions(this) || {};
    const context = options.context || this.rootContext || (this.options && this.options.context);
    const getOutputPath = options.getOutputPath || getRelativePath;
    const outputNodeModules = options.outputNodeModules || "node_modules";
    const platform = options.platform || "wechat";
    
    const filename = LoaderUtils.interpolateName(this, options.name, {
        context,
        content,
        regExp: options.regExp
    })
    .replace(/\[(?:ext\:([a-z]*))\]/ig, ( match, extname ) => {
        return getInterpolateExtname(extname, platform);
    });
    
    const dirname = path.dirname(getOutputPath(this.resourcePath, context, outputNodeModules));
    
    /// 写入文件。
    if ( options.emitFile || options.emitFile === void 0 ) {
        this.emitFile(path.join(dirname, filename), content);
    }
    
    const relativePath = path.dirname(getOutputPath(this.resourcePath, this._module.issuer.context, outputNodeModules));
    return `module.exports=${stringify(LoaderUtils.urlToRequest(path.join(relativePath, filename)))};`;
}

module.exports.raw = true;