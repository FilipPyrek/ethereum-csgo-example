var accounts;
var account;

window.onload = function() {
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    document.body.innerHTML = accounts.reduce(function(accumulator, account) {
      return accumulator + account + '<br />'
    }, '<b>Avalible accounts:</b> <br />');
  });
}
