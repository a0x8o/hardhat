import { task, HardhatUserConfig } from "@nomicfoundation/hardhat/config";
import { HardhatPluginError } from "@nomicfoundation/hardhat/plugins";

export default {
  tasks: [
    task("hello", "Prints a greeting")
      .addOption({
        name: "greeting",
        description: "The greeting to print",
        defaultValue: "Hello, World!",
      })
      .setAction(async ({ greeting }, _) => {
        console.log(greeting);

        if (greeting === "") {
          throw new HardhatPluginError(
            "example-plugin",
            "Greeting cannot be empty",
          );
        }
      })
      .build(),
  ],
} satisfies HardhatUserConfig;
