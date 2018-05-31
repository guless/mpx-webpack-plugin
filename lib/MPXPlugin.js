const MPXEntryPlugin = require("./MPXEntryPlugin");
const MPXDynamicEntryPlugin = require("./MPXDynamicEntryPlugin");
const MPXModuleFactory = require("./MPXModuleFactory");
const { SyncHook } = require("tapable");

const PLUGIN_NAME = "MPXPlugin";

module.exports = class MPXPlugin {
    constructor( options ) {
        options = options || {};
        
        this.name = options.name || "app";
        this.entry = null;
        this.platform = options.platform || "wechat";
    }
    
    apply( compiler ) {
        const entry = compiler.options.entry;
        
        if ( typeof entry == "string" || Array.isArray(entry) ) {
            compiler.options.entry = {}; // 跳过 EntryOptionPlugin 插件。
            
            this.entry = entry;
        }
        
        else if ( typeof entry == "object" ) {
            if ( !(this.name in entry) ) {
                throw new Error(`没有找到名为 "${this.name}" 的小程序入口点。`);
            }
            
            this.entry = entry[this.name];
            delete entry[this.name];
        }
        
        else if ( typeof entry == "function" ) {
            compiler.options.entry = {}; // 跳过 EntryOptionPlugin 插件。
            
            this.entry = entry;
        }
        
        compiler.hooks.entryOption.tap(PLUGIN_NAME, ( context ) => {
            if ( typeof this.entry == "function" ) {
                new MPXDynamicEntryPlugin(context, this.name, this.entry, this.platform).apply(compiler);
            }
            
            else {
                new MPXEntryPlugin(context, this.name, this.entry, this.platform).apply(compiler);
            }
        });
        
        /// 创建小程序模块工厂。
        compiler.hooks.miniprogramModuleFactory = new SyncHook(["miniprogramModuleFactory"]);
        
        compiler.hooks.beforeCompile.tap(PLUGIN_NAME, ( params ) => {
            const miniprogramModuleFactory = new MPXModuleFactory(compiler.resolverFactory);
            
            Object.assign(params, { 
                miniprogramModuleFactory 
            });
            
            compiler.hooks.miniprogramModuleFactory.call(miniprogramModuleFactory);
        });
        
        /// 配置小程序文件解析器。
        compiler.resolverFactory.hooks.resolveOptions
            .for("miniprogram")
            .tap(PLUGIN_NAME, resolveOptions => {
                return Object.assign({ fileSystem: compiler.inputFileSystem }, options.resolve, resolveOptions);
            });
            
        compiler.resolverFactory.hooks.resolver
            .for("miniprogram")
            .tap(PLUGIN_NAME, resolver => {
                new MPXResolverPlugin(this.platform).apply(resolver);
            });
    }
}