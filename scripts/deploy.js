// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  const [buyer, seller, inspector, lender] = await ethers.getSigners();

  const RealEstate = await ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.waitForDeployment();

  const realEstateAddr = await realEstate.getAddress();

  [1, 2, 3].forEach(async (value) => {
    const txn = await realEstate
      .connect(seller)
      .mint(
        `https://ipfs.io/ipfs/QmQUozrHLAusXDxrvsESJ3PYB3rUeUuBAvVWw6nop2uu7c/${value}.json`
      );
    await txn.wait();
  });

  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstateAddr,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();

  [1, 2, 3].forEach(async (value) => {
    const txn = await realEstate.connect(seller).approve(escrowAddress, value);
    await txn.wait();
  });

  let txn;
  txn = await escrow
    .connect(seller)
    .list(1, buyer.address, tokens(20), tokens(10));
  await txn.wait();

  txn = await escrow
    .connect(seller)
    .list(2, buyer.address, tokens(15), tokens(5));
  await txn.wait();

  txn = await escrow
    .connect(seller)
    .list(3, buyer.address, tokens(10), tokens(5));
  await txn.wait();

  console.log("Finished deploying");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
