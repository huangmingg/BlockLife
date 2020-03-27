const IPFS = require('ipfs');
let IPFSnode;

//IPFS structure
//root/<Ethereum address>/<cert>

export async function setup() {
    IPFSnode  = await IPFS.create();
}

export async function send(destIPFSpath, srcFilepath,  { create: true }) {
    //ENSURE IPFS path fits the structure above!
    var hash = await ipfs.files.write(destIPFSpath, srcFilepath, { create: true })

}

export async function retrieve(hash) {
    let buffer = await ipfs.files.read(path) //returns buffer. need to convert to something usable
    //buffer.toString('utf8')

}