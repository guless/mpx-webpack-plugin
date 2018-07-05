const PLUGIN_NAME = "MPXLoadChunksPlugin";

module.exports = class MPXLoadChunksPlugin {
    constructor( chunks ) {
        this.chunks = chunks || [];
    }
    
    apply( compiler ) {
        // console.log("apply MPXLoadChunksPlugin");
        // compiler.hooks.thisCompilation.tap(PLUGIN_NAME, ( compilation ) => {
        //     const { chunkTemplate } = compilation;
            
        //     chunkTemplate.hooks.render.tap(PLUGIN_NAME, ( modules, chunk ) => {
        //         // console.log(modules);
                
        //         modules.add(`console.log("xxx")`);
                
                
        //     });
            
            
        // });
        // console.log(this.chunks);
        
    }
}