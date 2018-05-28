const MPXEntryDependency = require("./dependencies/MPXEntryDependency");

const PLUGIN_NAME = "MPXEntryPlugin";

module.exports = class MPXEntryPlugin {
    constructor( context, name, entries ) {
        this.context = context;
        this.name = name;
        this.entries = entries;
    }
    
    apply( compiler ) {
        compiler.hooks.compilation.tap(PLUGIN_NAME, ( compilation, 
                                                    { mpxGroupFactory, mpxModuleFactory } ) => {
            /// 注册小程序模块工厂。
            compilation.dependencyFactories.set(MPXEntryDependency, mpxGroupFactory);
        });
        
        compiler.hooks.make.tapAsync(PLUGIN_NAME, ( compilation, callback ) => {
            const dependency = new MPXEntryDependency(this.name, this.entries);
            
            /// 添加 App 入口点。
            compilation.addEntry(this.context, dependency, this.name, callback);
        });
    }
}