var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

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
});



// router.post('/issueCertificate', cors(), function(req, res, next) {
//     var commonAddress = accounts[10]
//     var files = req.body.files
//     var returnedHash = files.uploadToOffChainDB(files)
//     web3.eth.issueCertificate(returnedHash, {from : commonAddress});
// });


router.get('/getContractOwner', cors(), function(req, res, next) {
  ecosystemInstance.methods.getContractOwner().call()
  .then((result) => {
    console.log(`Contract owner is : ${result}`)
    res.send({'success' : true, 'message':result});
  });
});


router.get('/getBalance', cors(), function(req, res, next) {
  web3.eth.getBalance(accounts[1])
  .then((result) => {
    console.log(result)
    res.send({'success' : true, 'message':result});
  });
});


router.get('/getName', cors(), async function(req, res, next) {
  web3.eth.getBalance(accounts[1])
  .then((result) => {
    console.log(result)
    res.send({'success' : true, 'message':result});
  });
});


router.post('/createOrganization', cors(), async function(req, res, next) {
  var name = web3.utils.hexToBytes(web3.utils.asciiToHex(req.body.name));
  var UEN = web3.utils.hexToBytes(web3.utils.asciiToHex(req.body.UEN));
  var industry = web3.utils.hexToBytes(web3.utils.asciiToHex(req.body.industry));
  var address = web3.utils.hexToBytes(web3.utils.asciiToHex(req.body.address));
  await ecosystemInstance.methods.createOrganization(name, UEN, industry, address).send({from : accounts[1],  gas: 1000000})
  .then(function(result) {
    console.log(result)
  })
  .catch(function(err) {
    console.log(err)
  })
});



module.exports = router;


