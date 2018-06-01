const MPXEntryDependency = require("./dependencies/MPXEntryDependency");
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
                                                    { normalModuleFactory, miniprogramModuleFactory } ) => {
            /// 注册 webpack 常规入口点工厂。
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
            
            /// 注册小程序模块工厂。
            compilation.dependencyFactories.set(MPXEntryDependency, miniprogramModuleFactory);
        });
        
        compiler.hooks.make.tapAsync(PLUGIN_NAME, ( compilation, callback ) => {
            const dependency = new MPXEntryDependency(this.entry, this.name);
            
            /// 添加 App 入口点。
            compilation.addEntry(this.context, dependency, this.name, callback);
        });
    }
}