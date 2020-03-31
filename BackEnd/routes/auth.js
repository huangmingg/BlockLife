var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const cache = require("memory-cache");
const crypto = require('crypto');
const eutil = require('ethereumjs-util');
const { uuid } = require('uuidv4');


const MetaAuth = require('meta-auth');
const metaAuth = new MetaAuth({
    signature: 'MetaSignature',
    message: 'MetaMessage',
    address: 'MetaAddress',
    banner: 'Welcome to LifeBlock'
    }
    );

router.get('/metaMask/:MetaAddress', metaAuth, cors(),(req, res) => {
  // Request a challenge from the server
//   res.send(req.metaAuth.challenge)
  if (req.metaAuth && req.metaAuth.challenge) {
    res.send({"success":true,"msg":req.metaAuth.challenge})
  }
});

router.get('/metaMask/:MetaMessage/:MetaSignature', metaAuth, cors(), (req, res) => {
    console.log(req.metaAuth.recovered)
    if (req.metaAuth && req.metaAuth.recovered) {
        // Signature matches the cache address/challenge
        // Authentication is valid, assign JWT, etc.
        res.send({"success": true, "message" :req.metaAuth.recovered});
      } else {
        // Sig did not match, invalid authentication
        // res.send(req.metaAuth.recovered);
        res.send({"success" : false})
        // res.status(400).send();
      };
});

module.exports = router;


