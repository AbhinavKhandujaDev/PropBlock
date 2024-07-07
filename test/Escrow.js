const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;
  let realEstateAddr, escrowAddress;

  before(async () => {
    [buyer, seller, inspector, lender] = await ethers.getSigners();

    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();

    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );

    await transaction.wait();

    realEstateAddr = await realEstate.getAddress();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstateAddr,
      seller.address,
      inspector.address,
      lender.address
    );
    escrowAddress = await escrow.getAddress();

    // Approve property
    transaction = await realEstate.connect(seller).approve(escrowAddress, 1);
    await transaction.wait();

    transaction = await escrow
      .connect(seller)
      .list(1, buyer.address, tokens(10), tokens(5));
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("returns NFT address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstateAddr);
    });
    it("returns seller", async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
    });
    it("returns inspector", async () => {
      const result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
    });
    it("returns lender", async () => {
      const result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
    });
  });

  describe("Listing", async () => {
    it("updates as listed", async () => {
      const isListed = await escrow.isListed(1);
      expect(isListed).to.be.equal(true);
    });

    it("updates ownership", async () => {
      const oAddr = await realEstate.ownerOf(1);
      expect(oAddr).to.be.equal(escrowAddress);
    });
    it("returns buyer", async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address);
    });
    it("updates purchase price", async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.be.equal(tokens(10));
    });
    it("updates ownership", async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.be.equal(tokens(5));
    });
  });
});
