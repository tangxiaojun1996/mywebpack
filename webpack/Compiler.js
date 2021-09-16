const fs = require("fs");
const path = require("path");
const tapable = require("tapable");
const Compilation = require("./Compilation");

const { AsyncParallelHook } = tapable;

class Compiler {
  constructor(options) {
    this.entry = options.entry;
    this.output = options.output;
    this.loaders = options.loaders;
    this.modules = [];
    this.hooks = {
      make: AsyncParallelHook(["compilation"]),
    };
  }

  run() {
    console.log("start compiler.run");
    const compilation = new Compilation(this);
    console.log("init compilation");

    this.hooks.make.callAsync(compilation, () => {
      compilation.seal(() => {
        console.log("end seal");
        this.emitAssets(compilation);
      });
    });
  }

  emitAssets(compilation) {
    console.log("emit");
    const outputPath = path.join(this.output.path, this.output.filename);

    compilation.chunks.forEach((chunk) => {
      fs.writeFileSync(outputPath, chunk, "utf-8");
    });
  }
}

module.exports = Compiler;
