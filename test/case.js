contract('CaseContract', (accounts) => {
  const owner = accounts[0];

  it('should return 128 slots (3 items, 125 empty)', () => {
    const cscase = CaseContract.deployed();
    const account = accounts[1];

    return Promise.all([
      cscase.emit.sendTransaction(account, 1, 1, { from: owner }),
      cscase.emit.sendTransaction(account, 2, 1, { from: owner }),
      cscase.emit.sendTransaction(account, 3, 2, { from: owner })
    ]).then(() => {
      return cscase.getByOwner.call(account, 0, { from: account }).then((data) => {
        assert.equal(
          data[0].valueOf(), 3,
          `Max offset doesn't equal to number of items`
        );
        assert.equal(
          data[1].length, data[2].length,
          `Ids array length doesn't equal CollectionIds array length`
        );
        assert.equal(
          data[1].length, 128,
          `Ids array doesn't have expected length of 128`
        );
      });
    });
  });

  it(`max offset from 'getByOwner' should equal to value from 'getDepositSize'`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[2];

    return Promise.all([
      cscase.emit.sendTransaction(account, 4, 1, { from: owner }),
      cscase.emit.sendTransaction(account, 5, 2, { from: owner }),
      cscase.emit.sendTransaction(account, 6, 3, { from: owner }),
      cscase.emit.sendTransaction(account, 7, 3, { from: owner })
    ]).then(() => {
      return cscase.getByOwner.call(account, 0, { from: account }).then((data) => {
        return cscase.getDepositSize.call(account, 0, { from: account }).then((depositSize) => {
          assert.equal(
            data[0].valueOf(), depositSize,
            `Max offset doesn't equal to deposit size`
          );
          assert.equal(
            depositSize, 4,
            `Deposit size doesn't equal to number of items`
          );
        });
      });
    });
  });

  it(`should throw an error because of duplicated id while 'emit'`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[3];

    return cscase.emit.sendTransaction(account, 8, 1, { from: owner }).then(() => {
      return cscase.emit.sendTransaction(account, 8, 1, { from: owner })
        .then(() => {
          assert(
            false,
            'Transaction with duplicated id was successful'
          );
        })
        .catch((err) => {
          if (err.name == 'AssertionError') throw err;
          assert(
            err.message.includes('invalid JUMP'),
            `Transaction with duplicated id didn't throw an 'invalid JUMP'`
          );
        });
    });
  });

  it(`should successfully create items using 'emit'`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[4];

    return Promise.all([
      cscase.emit.sendTransaction(account, 9, 1, { from: owner }),
      cscase.emit.sendTransaction(account, 10, 1, { from: owner }),
      cscase.emit.sendTransaction(account, 11, 1, { from: owner })
    ])
    .catch((err) => {
      assert(
        !err.message.includes('invalid JUMP'),
        `Some of transactions didn't succeed`
      );
    });
  });

  it(`should successfully remove item using 'remove'`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[5];

    return cscase.emit.sendTransaction(account, 12, 4, { from: owner }).then(() => {
      return cscase.remove.sendTransaction(12, { from: owner }).then(() => {
        return cscase.getById.call(12, { from: account })
          .then(() => {
            assert(
              false,
              'Item was not removed.'
            );
          })
          .catch((err) => {
            if (err.name == 'AssertionError') throw err;
            assert(
              err.message.includes('invalid JUMP'),
              `Getting removed item by ID didn't throw 'invalid JUMP'`
            );
          });
      });
    });
  });

  it(`should not allow creation of the item`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[6];

    return cscase.emit.sendTransaction(account, 13, 4, { from: account })
      .then(() => {
        assert(
          false,
          'Item was created.'
        );
      })
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert(
          err.message.includes('invalid JUMP'),
          `Trying to create an item didn't throw 'invalid JUMP'`
        );
      });
  });

  it(`should not allow removal of the item`, () => {
    const cscase = CaseContract.deployed();
    const account = accounts[7];

    return cscase.emit.sendTransaction(account, 14, 4, { from: owner }).then(() => {
      return cscase.remove.sendTransaction(14, { from: account })
        .then(() => {
          assert(
            false,
            'Item was removed.'
          );
        })
        .catch((err) => {
          if (err.name == 'AssertionError') throw err;
          assert(
            err.message.includes('invalid JUMP'),
            `Trying to remove an item didn't throw 'invalid JUMP'`
          );
        });
    });
  });

});
