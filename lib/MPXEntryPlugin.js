const MPXMultiEntryDependency = require("./dependencies/MPXMultiEntryDependency");
const MPXSingleEntryDependency = require("./dependencies/MPXSingleEntryDependency");
const MPXAppMetaData = require("./metadata/MPXAppMetaData");
const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency");

const PLUGIN_NAME = "MPXEntryPlugin";

module.exports = class MPXEntryPlugin {
    constructor( context, name, entry ) {
        this.context = context;
        this.name = name;
        this.entry = entry;
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation, 
                                                    { normalModuleFactory, mpxMultiModuleFactory } ) => {
            /// 注册 webpack 常规入口点工厂。
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
            
            /// 注册小程序模块工厂。
            compilation.dependencyFactories.set(MPXMultiEntryDependency, mpxMultiModuleFactory);
            compilation.dependencyFactories.set(MPXSingleEntryDependency, normalModuleFactory);
        });
        
        compiler.hooks.make.tapAsync(PLUGIN_NAME, ( compilation, callback ) => {
            const dependency = new MPXMultiEntryDependency(this.entry, new MPXAppMetaData(this.name));
            
            /// 添加 App 入口点。
            compilation.addEntry(this.context, dependency, this.name, callback);
        });
    }
}