class EntryPlugin {
  apply(compiler) {
    console.log("apply make hook plugin - EntryPlugin");
    compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
      console.log("start make hook");
      compilation.build(callback);
    });
  }
}

module.exports = EntryPlugin;
