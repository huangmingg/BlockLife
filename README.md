# IS4302 Project 

### Setting up of truffle development 

###### Installing the required pakages globally
npm install -g truffle
<br>
npm install -g ganache-cli
<br>
Once done, run the following command to deploy blockchain server (default at 127.0.0.1:8545)
<br>
ganache-cli --seed IS4302 -e 10000000000000 -l 80000000  // do not close
###### Go to the TruffleNetwork folder
cd BackEnd
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


For testing purposes, here are the addresses of the users of this system
0xEa9764d165461e4e729886A023b2BBd389CDA959 -- Contract Owner
0xB422d54Cc2b92A2462f035E31d34e11e61ff54a1 -- User 1 Bob 
0x8B6796841E411e725C16F18894c734FA44Fc0cD5 -- User 2 Peter
0xb2FA54Eba47928530800f7479AEF15B7a915339d -- User 3 James
0x28f33204e50Dd9b62A460Ed7431165f4A42fd339 -- Institution 1 Facebook
0xEa27b334967Fa7864748c39918EA6234Cd420747 -- Institution 2 Amazon
0x204729E93654fefc04E1614Ba634f69e362Cf226 -- Institution 3 Apple
0xdAC014022A66ED4e617CE19102ee0DC28094147a -- Institution 4 Netflix
0xac04944599Ca5BcD758AdBf49D338e31f3E139F6 -- Institution 5 Google