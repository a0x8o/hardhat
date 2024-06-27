import type { HardhatPlugin } from "@nomicfoundation/hardhat-core/types/plugins";

// Note: When importing a plugin, you have to export its types, so that its
// type extensions, if any, also get loaded.
export type * from "./hardhat-foo/index.js";
import hardhatFoo from "./hardhat-foo/index.js";
import run from "./run/index.js";

export const builtinPlugins: HardhatPlugin[] = [hardhatFoo, run];
