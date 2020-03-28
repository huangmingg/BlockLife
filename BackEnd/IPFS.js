const IPFS = require('ipfs');
let IPFSnode;

//IPFS structure
//root/<Ethereum address>/<cert>

export async function setup() {
    IPFSnode  = await IPFS.create();
}

export async function send(address, fileToSend) {
    let file = {path: address+'/'+fileToSend.name, content:fileToSend};
    return await ipfs.add(file).hash;
}

export async function retrieve(hash) {
    let buffer = await ipfs.cat(hash) //returns buffer. need to convert to something usable
    //buffer.toString('utf8')

}

//FOR TESTING
async function main () {
    const node = await IPFS.create()
    const version = await node.version()
    console.log('Version:', version.version)
    // ...
}

main()