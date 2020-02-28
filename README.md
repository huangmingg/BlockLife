# IS4302 Project 

### Setting up of truffle development 

1) Installing the required pakages globally
npm install -g truffle
npm install -g ganache-cli

Once done, run the following command to deploy blockchain server (default at 127.0.0.1:8545)
ganache-cli (Do not close)

2) Go to the TruffleNetwork folder
truffle migrate // to compile and deploy the contracts on the server



### Setting up of BackEnd

1) Go to the BackEnd folder and install the required packages (Express server will be deployed at port 3000)

cd BackEnd && npm install
nodemon www (Do not close)


### Setting up of FrontEnd

1) Go to the FrontEnd folder and install the required packages (Deployed at http://localhost:8100/)

cd FrontEnd && npm install
ionic serve (Do not close)


