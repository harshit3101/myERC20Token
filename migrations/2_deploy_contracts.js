const HanuToken = artifacts.require("HanuToken");
const HanuTokenSale = artifacts.require("HanuTokenSale");

module.exports = async function (deployer) {
  await deployer.deploy(HanuToken, 1000000);
  await deployer.deploy(HanuTokenSale, HanuToken.address, 1000000000000000);
};
