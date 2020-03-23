var express = require('express');
var router = express.Router();
var cors = require('cors')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// const MetaAuth = require('meta-auth');
// const metaAuth = new MetaAuth();

// router.get('/auth/:MetaAddress', metaAuth, cors(),(req, res) => {
//   // Request a challenge from the server
//   res.send(req.metaAuth.challenge)
// });

// router.get('/auth/:MetaMessage/:MetaSignature', metaAuth, (req, res) => {
//   if (req.metaAuth.recovered) {
//     // Signature matches the cached address/challenge
//     // Authentication is valid, assign JWT, etc.
//     res.send(req.metaAuth.recovered);
//   } else {
//     // Sig did not match, invalid authentication
//     res.status(400).send();
//   };
// });