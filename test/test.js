const { ethers } = require("hardhat");
const { expect } = require("chai");
const EthCrypto = require("eth-crypto");

describe("Spaceship Skin NFT", () => {
  let owner;
  let user;
  let withdrawWallet;
  let spaceshipNFT;
  let sola_token;
  const private_key =
    "b5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7";
  const processor_wallet = "0x12890D2cce102216644c59daE5baed380d84830c";

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    [owner, user, withdrawWallet] = accounts;
    const SolaToken = await ethers.getContractFactory("SOLA");
    sola_token = await SolaToken.deploy();
    const SolaTokenAddress = sola_token.address;
    const SpaceShipNFT = await ethers.getContractFactory("SpaceshipSkinNFT");
    spaceshipNFT = await SpaceShipNFT.deploy(
      SolaTokenAddress,
      processor_wallet
    );
  });

  describe("Set BaseURI", () => {
    it("Set BaseURI Success", async () => {
      const baseURI =
        "https://opensea-creatures-api.herokuapp.com/api/creature/1";
      await spaceshipNFT.setBaseURI(baseURI);
      expect(await spaceshipNFT.baseURI()).to.equal(
        "https://opensea-creatures-api.herokuapp.com/api/creature/1"
      );
    });
  });

  describe("Set Processor Wallet", () => {
    it("Set ProcessorWallet Success", async () => {
      await spaceshipNFT.setProcessorWallet(processor_wallet);
      expect(await spaceshipNFT.processor_wallet()).to.equal(processor_wallet);
    });
  });

  describe("Set Token Address", () => {
    it("Set TokenAddress Success", async () => {
      await spaceshipNFT.setTokenAddress(sola_token.address);
      expect(await spaceshipNFT.solaTokenAddress()).to.equal(
        sola_token.address
      );
    });
  });

  describe("Set Withdraw Wallet", () => {
    it("Set WithdrawWallet Success", async () => {
      await spaceshipNFT.setWithdrawWallet(withdrawWallet.address);
      expect(await spaceshipNFT.withdrawWallet()).to.equal(
        withdrawWallet.address
      );
    });
  });

  describe("Admin Mint", () => {
    it("Admin Mint Success", async () => {
      var uuids = ["1", "2", "3", "4", "10"];
      expect(await spaceshipNFT.balanceOf(owner.address)).to.equal(0);
      await spaceshipNFT.connect(owner).adminMint(owner.address, uuids);
      expect(await spaceshipNFT.balanceOf(owner.address)).to.equal(5);
    });
  });

  describe("Claim NFT", async () => {
    it("Claim Success", async () => {
      //signature parameters
      var skins = [
        "Companions",
        "Diamond Legend",
        "Bio Lumo",
        "Bio Lumo",
        "Bio Lumo",
      ];
      var uuids = ["1", "2", "3", "4", "10"];
      var expired_at = Date.now();
      var claimer = user.address.toString();
      var sola_amount = "";
      var eth_amount = "";

      // generate signature
      var skins_uuids = await spaceshipNFT.concatArrays(skins, uuids);
      var message =
        skins_uuids +
        expired_at.toString() +
        claimer +
        sola_amount +
        eth_amount;
      var msg_hash = EthCrypto.hash.keccak256(message);
      var signature = EthCrypto.sign(private_key, msg_hash);

      // set processor wallet address
      await spaceshipNFT.setProcessorWallet(processor_wallet);
      expect(await spaceshipNFT.processor_wallet()).to.equal(processor_wallet);

      // claim NFT
      await spaceshipNFT
        .connect(user)
        .claimNFT(skins, uuids, expired_at.toString(), signature, claimer);

      // check if claim success
      expect(await spaceshipNFT.totalSupply()).to.equal(uuids.length);

      // if claim successed, check the tokenID from UUID
      expect(await spaceshipNFT.getTokenIdFromUUID("10")).to.equal(5);
    });
  });

  describe("Buy NFT", async () => {
    it("Buy Success", async () => {
      //set withdraw wallet
      await spaceshipNFT.setWithdrawWallet(withdrawWallet.address);
      expect(await spaceshipNFT.withdrawWallet()).to.equal(
        withdrawWallet.address
      );

      //set Sola token address to the contract
      await spaceshipNFT.setTokenAddress(sola_token.address);
      expect(await spaceshipNFT.solaTokenAddress()).to.equal(
        sola_token.address
      );

      //mint sola to user
      await sola_token
        .connect(owner)
        .mint(user.address, ethers.utils.parseEther("100"));
      expect(await sola_token.balanceOf(user.address)).to.equal(
        ethers.utils.parseEther("100")
      );

      //approve sola to nft contract

      await sola_token
        .connect(user)
        .approve(spaceshipNFT.address, ethers.utils.parseEther("100"));
      //signature parameters
      var skins = [
        "Companions",
        "Diamond Legend",
        "Bio Lumo",
        "Bio Lumo",
        "Bio Lumo",
      ];
      var uuids = ["1", "2", "3", "4", "10"];
      var expired_at = Date.now();
      var buyer = user.address.toString();
      var sola_amount = ethers.utils.parseEther("100").toString();
      var eth_amount = ethers.utils.parseEther("1").toString();

      // generate signature
      var skins_uuids = await spaceshipNFT.concatArrays(skins, uuids);
      var message =
        skins_uuids + expired_at.toString() + buyer + sola_amount + eth_amount;
      var msg_hash = EthCrypto.hash.keccak256(message);
      var signature = EthCrypto.sign(private_key, msg_hash);

      // set processor wallet address
      await spaceshipNFT.setProcessorWallet(processor_wallet);
      expect(await spaceshipNFT.processor_wallet()).to.equal(processor_wallet);

      // Buy NFT
      await spaceshipNFT
        .connect(user)
        .buyNFT(
          skins,
          uuids,
          sola_amount,
          eth_amount,
          expired_at.toString(),
          signature,
          buyer,
          {
            value: ethers.utils.parseEther("1"),
          }
        );

      // check if claim success
      expect(await spaceshipNFT.totalSupply()).to.equal(uuids.length);

      // if claim successed, check the tokenID from UUID
      expect(await spaceshipNFT.getTokenIdFromUUID("10")).to.equal(5);

      // check if the eth or sola corrctly sent to withdrawWallet
      eth_balance = await ethers.provider.getBalance(withdrawWallet.address);

      // the test accont has 10000eth at first.
      expect(eth_balance).to.equal(ethers.utils.parseEther("10001"));
    });
  });
});
