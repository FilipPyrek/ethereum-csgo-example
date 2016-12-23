contract('CSGO_Case', (accounts) => {

  it('should create a case', () => {
    var csgo_case = CSGO_Case.deployed();

    return csgo_case.create.sendTransaction(456, 1, { from: accounts[0] });
  });

  it("should return 64 ids (3 taken, 61 empty)", () => {
    var csgo_case = CSGO_Case.deployed();

    return Promise.all([
      csgo_case.create.sendTransaction(123, { from: accounts[1] }),
      csgo_case.create.sendTransaction(465, { from: accounts[1] }),
      csgo_case.create.sendTransaction(789, { from: accounts[1] })
    ]).then(() => {
      csgo_case.list.call(accounts[1], 0, { from: accounts[1] }).then((data) => {
        const ids = data[0];
        const maxValue = data[1].valueOf();
        assert.equal(ids.length, 64, "Call didn't return 64 ids");
        assert.equal(ids.reduce(function(accumulator, id) {
          return web3.toDecimal(id) > 0 ? accumulator + 1 : accumulator;
        }, 0), 3, "Call didn't return 3 taken ids");
        assert.equal(ids.reduce(function(accumulator, id) {
          return web3.toDecimal(id) == 0 ? accumulator + 1 : accumulator;
        }, 0), 61, "Call didn't return 61 empty ids");
        assert.equal(maxValue, 3, "Call didn't return correct maxOffset");
      });
    });
  });

  it("should return 64 ids (2 taken, 62 empty) - offset test", () => {
    var csgo_case = CSGO_Case.deployed();

    return Promise.all([
      csgo_case.create.sendTransaction(123, { from: accounts[2] }),
      csgo_case.create.sendTransaction(465, { from: accounts[2] }),
      csgo_case.create.sendTransaction(789, { from: accounts[2] }),
      csgo_case.create.sendTransaction(753, { from: accounts[2] })
    ]).then(() => {
      csgo_case.list.call(accounts[2], 2, { from: accounts[2] }).then((data) => {
        const ids = data[0];
        const maxValue = data[1].valueOf();
        assert.equal(ids.length, 64, "Call didn't return 64 ids");
        assert.equal(ids.reduce((accumulator, id) =>
          web3.toDecimal(id) > 0 ? accumulator + 1 : accumulator
        , 0), 2, "Call didn't return 2 taken ids");
        assert.equal(ids.reduce((accumulator, id) =>
          web3.toDecimal(id) == 0 ? accumulator + 1 : accumulator
        , 0), 62, "Call didn't return 62 empty ids");
        assert.equal(maxValue, 4, "Call didn't return correct maxOffset");
      });
    });
  });

});
