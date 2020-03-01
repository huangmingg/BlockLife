// const ERC20 = artifacts.require("ERC20");
const Ecosystem = artifacts.require("Ecosystem");

module.exports = function(deployer) {
  deployer.then(() => {
      return deployer.deploy(Ecosystem);
  }).then((ecosystemContract) => {
      console.log(`Address of Ecosystem Contract : ${ecosystemContract.address}`);
    })
};
