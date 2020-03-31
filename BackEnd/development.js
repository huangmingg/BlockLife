const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
var _ = require('underscore');
const IPFS = require('./IPFS');
// Contract deployment -- Only used during development 

// DEFAULT 
// ACCOUNTS[0] == contractOwner
// ACCOUNTS[1] == user1 (Bob)
// ACCOUNTS[2] == user2 (Peter)
// ACCOUNTS[3] == user3 (James)
// ACCOUNTS[4] == institution1 (Facebook)
// ACCOUNTS[5] == institution1 (Amazon)
// ACCOUNTS[6] == institution1 (Apple)
// ACCOUNTS[7] == institution1 (Netflix)
// ACCOUNTS[8] == institution1 (Google)

var EcosystemJSON = require("./build/contracts/BlockEcosystem.json");
let abi = EcosystemJSON.abi;

let EcosystemContract = new web3.eth.Contract(abi);
EcosystemContract.options.data =  EcosystemJSON.bytecode;

let addressCount = 0;
let institutions = [];
let users = [];

const institutionsList = ["Facebook","Amazon","Apple","Netflix","Google"]
const userList = ["Bob","Peter","James"]

function generateRandom(b) {
    return Math.floor((Math.random() * b));
}

async function parseUsers() {
    for (j in userList) {
        addressCount++;
        var ethAddress = accounts[addressCount];
        users.push({'accountID': addressCount, 'userName' : userList[j], 'ethAddress' : ethAddress })
    }
}

async function parseInstitutions () {
    for (i in institutionsList) {
        addressCount++;
        var ethAddress = accounts[addressCount];
        institutions.push({'accountID': addressCount,'institutionName' : institutionsList[i], 'ethAddress' : ethAddress});    
    }
}

async function registerStakeholders () {
    console.log("Registering various stakeholders");
    // Register all users
    for (var user of users) {
        console.log(`Registering ${user['userName']} at ${user['ethAddress']}`);
        await ecosystemInstance.methods.registerIndividual().send({from : user['ethAddress'], gas : 1000000});
    }
    // Register all institutions
    for (var institution of institutions) {
        console.log(`Registering ${institution['institutionName']} at ${institution['ethAddress']}`);
        await ecosystemInstance.methods.registerInstitution(institution['ethAddress']).send({from : contractOwner, gas : 1000000});
    }
}

async function fillData() {
    for (i in institutions) {
        for (k in users) {
            numberInteractions = 1 + generateRandom(5);
            for (var j = 0; j < numberInteractions; j++) {
                var randomHash = web3.utils.keccak256(web3.utils.randomHex(36));
                var feedBack = web3.utils.asciiToHex(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20));
                console.log(`Adding Interaction ${randomHash} from ${institutions[i]['institutionName']} to ${users[k]['userName']}`)
                await ecosystemInstance.methods.addInteraction(randomHash, users[k]['ethAddress']).send({from : institutions[i]['ethAddress'], gas : 1000000});
                console.log(`Adding Feedback ${feedBack} from ${users[k]['userName']} to ${institutions[i]['institutionName']}`)
                await ecosystemInstance.methods.addFeedback(feedBack, institutions[i]['ethAddress']).send({from : users[k]['ethAddress'], gas : 1000000})
            }
            break;
        }
        break;
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
            await parseUsers();
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