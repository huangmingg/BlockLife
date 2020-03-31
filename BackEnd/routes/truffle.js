var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var devTools = require('../development.js');



function generateRandom(b) {
  return Math.floor((Math.random() * b));
}



const randomImageURL = ["https://cdn.mos.cms.futurecdn.net/6h8C6ygTdR2jyyUxkALwsc-1200-80.jpg",
                        "https://www.aspcapro.org/sites/default/files/styles/image_component/public/page/card/image/donkeynose.jpg?itok=s7-KmNux",
                        "https://media.npr.org/assets/img/2019/04/24/gettyimages-942051048-29251d02758b345d0e722ef87f412b13cc19a265-s800-c85.jpg"
                    ]

// Will interact with IFPS, uploads the file and return the hashed endpoint.
async function fileToHash(file) {
  // for now return the hash of file (will use await here)
  var hash = web3.utils.keccak256(file);
  return hash;
}

async function hashToFile(hash) {
  var imageURL = randomImageURL[generateRandom(randomImageURL.length)]
  return imageURL;
}

async function handleHashes(hashArray) {
  output = []
  for (i in hashArray) {
      var hash = hashArray[i]
      var hashImage = await hashToFile(hash);
      output.push({
        id : i,
        hash : hash,
        imageUrl : hashImage 
      })
  }
  return output;
}


router.get('/identity', cors(), async function(req,res,next) {
  var address = req.query.address.toString().toLowerCase();
  var mappedAddress = global.hardMap[address];
  await ecosystemInstance.methods.checkUserIdentity(mappedAddress).call({from : mappedAddress,  gas: 1000000})
  .then((result) => {
    res.send({'success' : true, 'message' : result})
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
})

// Retrieving of hash, available to public
router.get('/profile', cors(), async function(req, res, next) {
  var address = req.query.address;
  await ecosystemInstance.methods.getInteraction(address).call({from : address,  gas: 1000000})
  .then((result) => {
    if (result) {
      handleHashes(result).then((output) => res.send({'success' : true, 'message' : output}))
    } else {
      res.send({'success' : false, 'message' : `No Interactions found for user ${address}`})
    }
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});


// Posting of hash, only available for institutions
router.post('/hash', cors(), async function(req, res, next) {
  var file = req.body.file;
  var hash = await fileToHash(file);
  var recipient = req.body.recipient;
  var institution = req.body.institution;
  await ecosystemInstance.methods.addInteraction(hash, recipient).send({from : institution,  gas: 1000000})
  .then((result) => {
    console.log(result)
    // confirm what results is
    res.send({'success' : true, 'message' : `${hash} has been successfully uploaded for recipient ${recipient}`})
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});


// Posting of feedback, available to public for now
// Should only be available to people who have worked in the company before
router.post('/feedback', cors(), async function(req, res, next) {
  var feedback = web3.utils.asciiToHex(req.body.feedback);
  var institution = req.body.institution;
  var user = req.body.user;
  await ecosystemInstance.methods.addFeedback(feedback,institution).send({from : user, gas : 1000000})
  .then((result) => {
    console.log(result)
    // confirm what results is
    res.send({'success' : true, 'message' : `${feedback} has been successfully uploaded for institution ${institution}`})
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});

// Retrieving of feedback, available to public
router.get('/feedback', cors(), async function(req, res, next) {
  var address = req.query.address
  console.log(address);
  await ecosystemInstance.methods.getFeedback(address).call({from : address,  gas: 1000000})
  .then((result) => {
    console.log(result)
    if (!result) {
      res.send({'success' : false, 'message' : "Invalid address"})
    } else {
      output = []
      for (i in result) {
        output.push({'description' :result[i]})
      }
      res.send({'success' : true, 'message' : output})  
    }
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});




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



module.exports = router;


