const IPFS = require('ipfs');
const { globSource } = IPFS;
let IPFSnode;

//IPFS structure
//root/<Ethereum address>/<cert>

async function send(address) {

    for await (const file of IPFSnode.add(globSource(address))) {
        return file.cid
    }
}

async function retrieve(hash) {
     for await ( const file of IPFSnode.cat(hash)) { //returns buffer. need to convert to something usable
         return file
     }
}

//FOR TESTING
async function main () {
    IPFSnode = await IPFS.create();
    let hash = await send('./test.jpg');
    let test = await retrieve(hash);
    console.log("Test file in string form: " + test.toString());
}

//main();