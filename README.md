# IS4302 Project 

### Setting up of truffle development 

1) Installing the required pakages globally
npm install -g truffle
<br>
npm install -g ganache-cli
<br>
Once done, run the following command to deploy blockchain server (default at 127.0.0.1:8545)
<br>
ganache-cli (Do not close)
<br>
2) Go to the TruffleNetwork folder
<br>
truffle migrate // to compile and deploy the contracts on the server



### Setting up of BackEnd

1) Go to the BackEnd folder and install the required packages (Express server will be deployed at port 3000)
cd BackEnd && npm install
<br>
nodemon www (Do not close)


### Setting up of FrontEnd

1) Go to the FrontEnd folder and install the required packages (Deployed at http://localhost:8100/)
cd FrontEnd && npm install
<br>
ionic serve (Do not close)


