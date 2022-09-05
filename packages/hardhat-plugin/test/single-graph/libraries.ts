import { assert } from "chai";

import { deployRecipe } from "../helpers";
import { useEnvironment } from "../useEnvironment";

describe("libraries", () => {
  useEnvironment("minimal");

  it("should be able to deploy a contract that depends on a hardhat library", async function () {
    await this.hre.run("compile", { quiet: true });

    const result = await deployRecipe(this.hre, (m) => {
      const rubbishMath = m.library("RubbishMath");
      const dependsOnLib = m.contract("DependsOnLib", {
        libraries: {
          RubbishMath: rubbishMath,
        },
      });

      return { rubbishMath, dependsOnLib };
    });

    assert.isDefined(result);
    const math = result.rubbishMath;
    const contractThatDependsOnLib = result.dependsOnLib;

    const addition = await math.add(1, 2);
    assert.equal(addition, 3);

    const libBasedAddtion = await contractThatDependsOnLib.addThreeNumbers(
      1,
      2,
      3
    );

    assert.equal(libBasedAddtion, 6);
  });

  it("should be able to deploy a contract that depends on an artifact library", async function () {
    await this.hre.run("compile", { quiet: true });

    const libraryArtifact = await this.hre.artifacts.readArtifact(
      "RubbishMath"
    );

    const result = await deployRecipe(this.hre, (m) => {
      const rubbishMath = m.library("RubbishMath", libraryArtifact);
      const dependsOnLib = m.contract("DependsOnLib", {
        libraries: {
          RubbishMath: rubbishMath,
        },
      });

      return { rubbishMath, dependsOnLib };
    });

    assert.isDefined(result);
    const math = result.rubbishMath;
    const contractThatDependsOnLib = result.dependsOnLib;

    const addition = await math.add(1, 2);
    assert.equal(addition, 3);

    const libBasedAddtion = await contractThatDependsOnLib.addThreeNumbers(
      1,
      2,
      3
    );

    assert.equal(libBasedAddtion, 6);
  });

  it("should deploy a contract with an existing library", async function () {
    // given
    const libDeployResult = await deployRecipe(this.hre, (m) => {
      const rubbishMath = m.contract("RubbishMath");

      return { rubbishMath };
    });

    const libAddress = libDeployResult.rubbishMath.address;
    const libAbi = libDeployResult.rubbishMath.abi;

    const result = await deployRecipe(this.hre, (m) => {
      const rubbishMath = m.contractAt("RubbishMath", libAddress, libAbi);

      const dependsOnLib = m.contract("DependsOnLib", {
        libraries: {
          RubbishMath: rubbishMath,
        },
      });

      return { dependsOnLib };
    });

    assert.equal(await libDeployResult.rubbishMath.add(1, 2), 3);
    assert.equal(await result.dependsOnLib.addThreeNumbers(1, 2, 3), 6);
  });
});
