var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var IPFSTools = require('../IPFS.js');


function generateRandom(b) {
  return Math.floor((Math.random() * b));
}

const randomImageURL = ["https://cdn.mos.cms.futurecdn.net/6h8C6ygTdR2jyyUxkALwsc-1200-80.jpg",
                        "https://www.aspcapro.org/sites/default/files/styles/image_component/public/page/card/image/donkeynose.jpg?itok=s7-KmNux",
                        "https://media.npr.org/assets/img/2019/04/24/gettyimages-942051048-29251d02758b345d0e722ef87f412b13cc19a265-s800-c85.jpg"
                    ]

async function fileToHash(file) {
  var hash = await IPFSTools.send(file);
  console.log(hash)
  return hash;
}

async function hashToFile(hash) {
  var imageURL = await IPFSTools.retrieve(hash);
  return imageURL;
}

async function handleHashes(hashArray) {
  output = []
  hashArray.forEach(async(element, index) => {
    var dateTime = element['dateTime'];
    var isValid = element['isValid'];
    var hash = element['interactionHash'];
    console.log(`Hash is ${hash}`)
    // var input  = '32343630';
    var hashAscii = web3.utils.toAscii(hash);
    // var hashAscii = web3.utils.hexToAscii(hash);
    console.log(`Hash Ascii is ${hashAscii}`);
    var hashImage = await hashToFile(hashAscii);
    output.push({id : index, hash : hash, dateTime : dateTime, imageUrl : hashImage, isValid : isValid})    
  });
  // for (i in hashArray) {
  //     var interactionObject = hashArray[i];
  //     var dateTime = interactionObject['dateTime'];
  //     var hashHex = interactionObject['interactionHash'].toString();
  //     var hash = web3.utils.hexToUtf8(hashHex);
  //     // hash.then(res => console.log(res))
  //     // console.log(`Hash is ${hash}`)
  //     var isValid = interactionObject['isValid']
  //     var hashImage = await hashToFile(hash);
  //     output.push({
  //       id : i,
  //       hash : hash,
  //       dateTime : dateTime,
  //       imageUrl : hashImage,
  //       isValid :  isValid
  //     })
  // }
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



// registering of user
router.post('/register/user', cors(), async function(req, res, next) {
  var address = req.body.address;
  if (!web3.isAddress(address)) return;
  await ecosystemInstance.methods.registerIndividual().send({from : address, gas : 1000000})
  .then((result) => {
    // console.log(result)
    res.send({'success' : true, 'message' : `User ${address} has been successfully registered`})
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});

// registering of institution
router.post('/register/institution', cors(), async function(req, res, next) {
  var institution = req.body.institution;
  var user = req.body.user;
  if (!web3.isAddress(institution) || !web3.isAddress(user)) return;
  await ecosystemInstance.methods.registerInstitution(institution).send({from : user, gas : 1000000})
  .then((result) => {
    console.log(result)
    res.send({'success' : true, 'message' : `Institution ${address} has been successfully registered`})
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});

// Retrieving of hash, available to public
router.get('/profile', cors(), async function(req, res, next) {
  var address = req.query.address;
  await ecosystemInstance.methods.getInteraction(address).call({from : address,  gas: 1000000})
  .then(async(result) => {
    if (result) {
      // console.log(result)
      await handleHashes(result).then((output) => res.send({'success' : true, 'message' : output}))
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
  var dateTime = Date.now()
  await ecosystemInstance.methods.addInteraction(web3.utils.asciiToHex(hash), dateTime, recipient).send({from : institution,  gas: 1000000})
  .then((result) => {
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
  var dateTime = Date.now()
  await ecosystemInstance.methods.addFeedback(feedback, dateTime, institution).send({from : user, gas : 1000000})
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
        output.push({'description' : web3.utils.hexToAscii(result[i])})
      }
      res.send({'success' : true, 'message' : output})  
    }
  })
  .catch((err) => {
    res.send({'success' : false, 'message' : err})
  })
});

module.exports = router;


