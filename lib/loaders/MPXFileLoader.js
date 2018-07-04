const getRelativePath = require("../utils/getRelativePath");
const LoaderUtils = require("loader-utils");
const stringify = require("../utils/stringify");
const getInterpolateExtname = require("../utils/getInterpolateExtname");
const getTopName = require("../utils/getTopName");
const path = require("path");
const { WECHAT } = require("../platforms");

function interpolateName( context, platform, name, options ) {
    return LoaderUtils.interpolateName(context, name, options)
        .replace(/\[topname\]/ig, () => getTopName(context.resourcePath))
        .replace(/\[(?:ext\:([a-z]*))\]/ig, ( match, extname ) => getInterpolateExtname(extname, platform));
}

module.exports = function( content ) {
    const options = LoaderUtils.getOptions(this) || {};
    const context = options.context || this.rootContext || (this.options && this.options.context);
    const getOutputPath = options.getOutputPath || getRelativePath;
    const outputNodeModules = options.outputNodeModules || "node_modules";
    const platform = options.platform || WECHAT;
    
    const filename = interpolateName(this, platform, options.name, { context, content, regExp: options.regExp });
    const dirname  = path.dirname(getOutputPath(this.resourcePath, context, outputNodeModules));
    const output   = path.join(dirname, filename);
    
    console.log("emit:", output);
    
    /// 写入文件。
    if ( options.emitFile || options.emitFile === void 0 ) {
        this.emitFile(output, content);
    }
    
    // /// 导出引用路径。
    // let exported = null;
    
    // if ( options.exportRelativePath ) { // 导致相对文件位置。
    //     exported = path.relative(this._module.issuer.context, this.resourcePath);
    // }
    
    // console.log("exported:", exported);
    
    
    // exported = stringify(LoaderUtils.urlToRequest(exported));
    return `module.exports=""`;
    
    
    // console.log("----------------[export]---------------");
    // console.log("output:", output);
    // // console.log("public:", __webpack_public_path__);
    // console.log("resource:", this.resourcePath);
    // console.log("issuer:", this._module.issuer.context);
    
    
    // return `module.exports=""`;
    
    // const relativePath = path.dirname(getOutputPath(this.resourcePath, this._module.issuer.context, outputNodeModules));
    // return `module.exports=${stringify(LoaderUtils.urlToRequest(path.join(relativePath, filename)))};`;
}

module.exports.raw = true;