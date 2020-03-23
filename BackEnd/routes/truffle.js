var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

router.get('/fetchAddress', cors(), async function(req, res, next) {
  web3.eth.getAccounts()
  .then(function(result){
    account = result[0];
    console.log(account)
    res.send({'success' : true, 'message':account});

  })
  .catch(function(error) {
    console.log(error)
    res.send({'success' : false, 'message': error});
  })
});

router.get('/profile', cors(), async function(req, res, next) {
  // do something
  var address = accounts[0]
  await ecosystemInstance.methods.getInteraction(address).call({from : address,  gas: 1000000})
  .then((result) => {
    output = []
    for (i in result) {
      output.push({'description' :result[i]})
    }
    res.send({'success' : true, 'message' : output})
  })
});



module.exports = router;


