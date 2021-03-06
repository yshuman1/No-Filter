const { expect, assert } = require("chai");
const NoFilterRegistry = artifacts.require("NoFilterRegistry");
const utils = require("./helpers/Utils");

let contract_two = 0x439bbb468fa1102398dca52fb9a4cb5e97a07be1;

let contractInstance = null;

beforeEach(async () => {
  contractInstance = await NoFilterRegistry.deployed();
});

contract("NoFilterRegistry Tests", async accounts => {
  it("contract should be owned by the correct address", async () => {
    let owner = await contractInstance.owner.call();
    expect(owner.valueOf()).to.equal(accounts[0]);
  });

  it("should update backend contract address", async () => {
    await contractInstance.changeBackend(contract_two);
    let expected = await contractInstance.backendContract();
    assert.equal(contract_two, expected);
  });

  it("should save previous contract addresses in an array", async () => {
    await contractInstance.changeBackend(contract_two);

    let expected = 0x0000000000000000000000000000000000000000;
    let previousBackends = await contractInstance.previousBackends(0);

    assert.equal(previousBackends, expected);
  });

  it("should throw when a non owner attempts to changeBackend", async () => {
    try {
      await contractInstance.changeBackend(contract_two, {
        from: accounts[2]
      });
      assert(false, "Calling from an address other than the owner should fail");
    } catch (e) {}
  });

  it("should return length of previousBackend array", async () => {
    let expected = 1;

    await contractInstance.changeBackend(contract_two);
    assert.equal(await contractInstance.previousBackendsLength(), expected);
  });
});
