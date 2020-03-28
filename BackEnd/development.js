const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var _ = require('underscore');
const IPFS = require('./IPFS');
// Contract deployment -- Only used during development 

var EcosystemJSON = require("./build/contracts/BlockEcosystem.json");
let abi = EcosystemJSON.abi;

let EcosystemContract = new web3.eth.Contract(abi);
EcosystemContract.options.data =  EcosystemJSON.bytecode;

let addressCount = 0;
let institutions = [];

const institutionsList = ["Facebook","Amazon","Apple","Netflix","Google"]

function generateRandom(b) {
    return Math.floor((Math.random() * b));
}

async function parseInstitutions () {
        for (i in institutionsList) {
            addressCount++;
            var ethAddress = accounts[addressCount];
            institutions.push({'instutitionID': i,'institutionName' : institutionsList[i], 'ethAddress' : ethAddress});    
    }
}

async function registerStakeholders () {
    console.log("Registering various stakeholders");
    // Register all institutions
    for (i in institutions) {
        console.log(`Registering ${institutions[i]['institutionName']} at ${institutions[i]['ethAddress']}`);
        await ecosystemInstance.methods.registerInstitution(institutions[i]['ethAddress']).send({from : contractOwner, gas : 1000000});
    }
}

async function fillData() {
    for (i in institutions) {
        numberInteractions = 1 + generateRandom(5);
        for (var j = 0; j < numberInteractions; j++) {
            console.log(j)
            var user = accounts[0]
            var randomHash = web3.utils.keccak256(web3.utils.randomHex(36));
            console.log(`Adding Interaction ${randomHash} from ${institutions[i]['institutionName']}`)
            await ecosystemInstance.methods.addInteraction(randomHash, user).send({from : institutions[i]['ethAddress'], gas : 1000000});
        }
    }

}

async function startNetwork () {
    web3.eth.getAccounts()
    .then(function(result){ 
        global.accounts = result;
        global.contractOwner = result[0];
        EcosystemContract.deploy().send({from: accounts[0], gas: 20000000})
        .then(async function(ecosystemInstance){
            global.ecosystemInstance = ecosystemInstance;
            console.log(`Ecosystem Contract has been deployed at : ${ecosystemInstance.options.address} by ${accounts[0]}`);
            await parseInstitutions();
            await registerStakeholders();
            await fillData();
            //await IPFS.setup();
            })
    .catch(function(error) {
      console.log(error)
        })    
    });
}


module.exports = {
    startNetwork : async function () {
        startNetwork();
    }
  };