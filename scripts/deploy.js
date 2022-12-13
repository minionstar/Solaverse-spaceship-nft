// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const sola_token = "0x0972b0d7924Ab64A775225A23A6F00841FA52372"
  const processor_wallet = "0x0972b0d7924Ab64A775225A23A6F00841FA52372"
  const SpaceShipNFT = await hre.ethers.getContractFactory("SpaceshipSkinNFT");
  const spaceshipNFT = await SpaceShipNFT.deploy(sola_token, processor_wallet);
  console.log(
    `Contract successfully deployed to ${spaceshipNFT.address}`
  );

  // await hre.run("verify:verify", {
  //   address: spaceshipNFT.address,
  //   constructorArguments: [
  //     "0x0972b0d7924Ab64A775225A23A6F00841FA52372",
  //     "0x0972b0d7924Ab64A775225A23A6F00841FA52372"
  //   ],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
