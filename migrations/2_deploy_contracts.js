const HanuToken = artifacts.require("HanuToken");

module.exports = function (deployer) {
  deployer.deploy(HanuToken, 1000000);
};
