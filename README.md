# IS4302 Project 

### Setting up of truffle development 

###### Installing the required pakages globally
npm install -g truffle
<br>
npm install -g ganache-cli
<br>
Once done, run the following command to deploy blockchain server (default at 127.0.0.1:8545)
<br>
ganache-cli --seed IS4302  // do not close
###### Go to the TruffleNetwork folder

npm install @openzeppelin/contracts // to download and install dependencies

truffle migrate // to compile and deploy the contracts on the server



### Setting up of BackEnd

###### Go to the BackEnd folder and install the required packages (Express server will be deployed at port 3000)
cd BackEnd && npm install
<br>
nodemon www // do not close


### Setting up of FrontEnd

###### Go to the FrontEnd folder and install the required packages (Deployed at http://localhost:8100/)
cd FrontEnd && npm install
<br>
npm i @angular-devkit/build-angular@0.803.24 //to avoid an error

ionic serve // do not close


