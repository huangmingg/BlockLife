const IPFS = require('ipfs');
const CID = require('cids');

async function send(image) {
    let IPFSnode = global.IPFS
    try {
        for await (const file of IPFSnode.add(image)) {
            console.log(`File CID is ${file.cid.toBaseEncodedString()}`);
            return file.cid.toBaseEncodedString();
        }    
    } catch (err) {
        console.log(err)
    }
}

async function retrieve(hash) {
    hash = new CID(hash)
    let IPFSnode = global.IPFS
    try {
        for await ( const file of IPFSnode.get(hash)) { //returns buffer. need to convert to something usable
            return file
        }   
    } catch (err) {
        console.log(err)
    }
}

//FOR TESTING
async function createIPFS () {
    var IPFSNode = await IPFS.create();
    return IPFSNode;
}

module.exports = {
    createIPFS : function () {
        return createIPFS();
    },
    retrieve : async function (hash) {
        return await retrieve(hash);
    },
    send : async function (hash) {
        return await send(hash);
    }
  };