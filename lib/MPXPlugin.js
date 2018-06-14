const MPXEntryPlugin = require("./MPXEntryPlugin");
const MPXDynamicEntryPlugin = require("./MPXDynamicEntryPlugin");
const MPXMultiModuleFactory = require("./MPXMultiModuleFactory");
const MPXResolverPlugin = require("./MPXResolverPlugin");
const MPXJsonModulesPlugin = require("./MPXJsonModulesPlugin");
const MPXNormalModulesPlugin = require("./MPXNormalModulesPlugin");
const MPXSplitChunksPlugin = require("./MPXSplitChunksPlugin");
const { SyncHook } = require("tapable");

const PLUGIN_NAME = "MPXPlugin";

module.exports = class MPXPlugin {
    constructor( options ) {
        options = options || {};
        
        this.name = options.name || "app";
        this.entry = null;
        this.platform = options.platform || "wechat";
        this.getChunkName = options.getChunkName;
        this.outputNodeModules = options.outputNodeModules;
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
                new MPXDynamicEntryPlugin(context, this.name, this.entry).apply(compiler);
            }
            
            else {
                new MPXEntryPlugin(context, this.name, this.entry).apply(compiler);
            }
        });
        
        /// 创建小程序模块工厂。
        compiler.hooks.mpxMultiModuleFactory = new SyncHook(["mpxMultiModuleFactory"]);
        
        compiler.hooks.beforeCompile.tap(PLUGIN_NAME, ( params ) => {
            const mpxMultiModuleFactory = new MPXMultiModuleFactory(compiler.resolverFactory);
            
            Object.assign(params, { 
                mpxMultiModuleFactory 
            });
            
            compiler.hooks.mpxMultiModuleFactory.call(mpxMultiModuleFactory);
        });
        
        /// 配置小程序文件解析器。
        compiler.resolverFactory.hooks.resolveOptions
            .for("miniprogram")
            .tap(PLUGIN_NAME, resolveOptions => {
                return Object.assign({ fileSystem: compiler.inputFileSystem }, compiler.options.resolve, { unsafeCache: false }, resolveOptions);
            });
            
        compiler.resolverFactory.hooks.resolver
            .for("miniprogram")
            .tap(PLUGIN_NAME, resolver => {
                new MPXResolverPlugin("before-existing-file", this.platform, "resolved").apply(resolver);
            });
            
        /// 小程序普通(Normal)模块插件。
        new MPXNormalModulesPlugin().apply(compiler);
        
        /// 小程序 JSON 解析插件
        new MPXJsonModulesPlugin().apply(compiler);
        
        /// 分离小程序页面(Page)、组件(Component)。
        new MPXSplitChunksPlugin({ "getChunkName": this.getChunkName, "outputNodeModules": this.outputNodeModules }).apply(compiler);
    }
}