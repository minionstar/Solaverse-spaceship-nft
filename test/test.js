const { ethers } = require("hardhat");
const { expect } = require("chai");
describe("Spaceship Skin NFT", () => {
  let owner;
  let user;
  let processor_wallet;
  let spaceshipNFT;
  let sola_token;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [owner, user, processor_wallet] = accounts;
    const SolaToken = await ethers.getContractFactory("SOLA");
    sola_token = await SolaToken.deploy();
    const SolaTokenAddress = sola_token.address;
    const ProcessorWallet = processor_wallet.address;
    const SpaceShipNFT = await ethers.getContractFactory("SpaceshipSkinNFT");
    spaceshipNFT = await SpaceShipNFT.deploy(SolaTokenAddress, ProcessorWallet);
  });

  describe("Admin Mint", () => {
    it("Mint Success", async () => {
      expect(await spaceshipNFT.balanceOf(owner.address)).to.equal(0);
      await spaceshipNFT.connect(owner).adminMint(owner.address, 20);
      expect(await spaceshipNFT.balanceOf(owner.address)).to.equal(20);
    });
  });

  describe("Claim NFT", async () => {
    it("Mint Success", async () => {
      const private_key =
        "b5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7";
        const public_key = "0x12890D2cce102216644c59daE5baed380d84830c"
      const EthCrypto = require("eth-crypto");
      var message = "hello";
      var msg_hash = EthCrypto.hash.keccak256(message);
      var signature = EthCrypto.sign(private_key, msg_hash);
      expect( await spaceshipNFT.recoverSignature(message, signature)).to.equal(public_key);
    });
  });
});
