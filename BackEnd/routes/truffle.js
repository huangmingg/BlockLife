var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));


// Fetch the first address
router.get('/fetchAddress', cors(), function(req, res, next) {
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

  // res.send({'success' : true, 'message':account});
});


router.get('/createOrganization', cors(), function(req, res, next) {
  ecosystemInstance.methods.getContractOwner().call()
  .then((result) => {
    console.log(`Contract owner is : ${result}`)
    res.send({'success' : true, 'message':result});
  });
  //console.log(result)
  



});

module.exports = router;


