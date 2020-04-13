const BlockEcosystem = artifacts.require("BlockEcosystem");

contract("BlockEcosystem", accounts => {
    let be;
    const contractOwner = accounts[0];
    const contractOwner_name = '0x74657374737472696e6720000000000000000000000000000000000000000000';
    
    const institution_1 = accounts[1];
    const institution_1_name = '0x74657374737472696e6700000000000000000000000000000000000000000000';
    const interactionHash_1 = '0x3031303230333034000000000000000000000000000000000000000000000000';
    const timestamp_1 = 20200412
    const individual_1 = accounts[2];
    const individual_1_name = '0x0000000000000000000000000000000000000000000000000000000061626364';
    
    const institution_2 = accounts[3];
    const institution_2_name = '0x6162636400000000000000000000000000000000000000000000000000000000';
    const interactionHash_2 = '0x3031303230333035000000000000000000000000000000000000000000000000';
    const timestamp_2 = 20200411
    const individual_2 = accounts[4];
    const individual_2_name = '0x0000000000000000000000000000000000000000000000000000000061626365';
    const timestamp_2_feedback = 20200414
    const feedbackText_2 = '0x3031303230333036000000000000000000000000000000000000000000000000';
    
    const institution_3 = accounts[5];
    const institution_3_name = '0x0000000000000000000000000000000000000000000000000000000001020304';
    const interactionHash_3 = '0x3031303230333035000000000000000000000000000000000000000000000000';
    const timestamp_3 = 20200414
    const individual_3 = accounts[6];
    const individual_3_name = '0x0000000000000000000000000000000000000000000000000000000061626368';
    
    const institution_4 = accounts[7];
    const institution_4_name = '0x0000000000000000000000000000000000000000000000000000000061626366';
    const interactionHash_4 = '0x3031303230333037000000000000000000000000000000000000000000000000';
    const timestamp_4 = 202000413
    const individual_4 = accounts[8];
    
    



    //contract owner tests
    it("Contract Owner: Should be able to register an institution", () =>
        BlockEcosystem.deployed()
        .then((_inst) => {
            be = _inst;
            return be.registerInstitution(institution_1, institution_1_name, {from: contractOwner});
        }).then(() => {
            return be.getName(institution_1)
        }).then((rsl) => {
            assert.equal(rsl.valueOf(), institution_1_name, "system has an incorrect registeded institution name");
        })
    );
    
    it("Contract Owner: Should be able to register a CA", () =>
        be.approveCA(institution_1, {from: contractOwner})
        .then(() => {
            return be.registerInstitution(institution_2, institution_2_name, {from: institution_1});
        }).then(() => {
            return be.getName(institution_2)
        }).then((rsl) => {
            assert.equal(rsl.valueOf(), institution_2_name, "CA is not being registered");
        })
    );

    it("Contract Owner: Should not be able to register an individual as an institution", async ()  => {
        try {
            await be.registerIndividual(individual_1_name, {from: individual_1});
            await be.registerInstitution(individual_1, individual_1_name, {from: contractOwner});
            assert.isTrue(false, 'Individual cannot also be an Institution');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only unregistered users have access to this function!',
                'Individual cannot also be an Institution'
            )
        }
    });
    
    it("Non-Contract Owner: Should not be able to register a CA", async () => {
        try {
            await be.registerInstitution(institution_3, institution_3_name, {from: institution_2});
            assert.isTrue(false, 'CA cannot be registered by non contract owner');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only authorized parties have access to this function!',
                'non contract owners could still register a CA');
        }
    });

    
    //CA tests
    it("CA: Should be able to register an institution", () =>
        be.registerInstitution(institution_3, institution_3_name, {from: institution_1})
        .then(() => {
            return be.getName(institution_3)
        }).then((rsl) => {
            assert.equal(rsl.valueOf(), institution_3_name, "function caller is not approved as a CA to register others");
        })
    );

    it("CA: Should not be able to register an individual as an institution", async ()  => {
        try {
            await be.registerInstitution(individual_1, individual_1_name, {from: institution_1});
            assert.isTrue(false, 'Individual cannot also be an Institution');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only unregistered users have access to this function!',
                'Individual cannot also be an Institution'
            )
        }
    });
    
    it("Non-CA: Should not be able to register institution", async () => {
        try {
            await be.registerInstitution(institution_4, institution_4_name, {from: institution_3});
            assert.isTrue(false, 'institution cannot be registered by non CA');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only authorized parties have access to this function!',
                'non CA could still register an institutions');
        }
    });
    
    
    //Institution tests
    it("Institution: Should be able to upload interaction", () =>
        be.addInteraction(interactionHash_1, timestamp_1, individual_1, {from: institution_1})
        .then((rsl) => {
            var add = rsl.logs[0].args[0]; 
            assert.equal(add, individual_1);
            return be.getInteraction.call(individual_1);
        }).then((rsl) => {
            assert.equal(rsl[0]["interactionHash"], interactionHash_1, "incorrect interactionHash")
            assert.equal(rsl[0]["dateTime"], timestamp_1, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], institution_1, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], individual_1, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")            
        })
    );
    
    it("Institution: Should be able to invalidate your issued interaction", () =>
        be.invalidateInteraction(interactionHash_1, individual_1, {from: institution_1})
        .then((rsl) => {
            var interactionHash = rsl.logs[0].args[0]; 
            assert.equal(interactionHash, interactionHash_1);
            return be.getInteraction.call(individual_1);
        }).then((rsl) => {
            assert.equal(rsl[0]["isValid"], false, "incorrect valid information of uploadedInteraction struct")
            return be.getUploadedInteraction.call({from: institution_1});
        }).then((rsl) => {
            assert.equal(rsl[0]["isValid"], false, "incorrect valid information of individualProfile struct")
        })
    );
    
    it("Institution: Should be able to get uploaded interactions you uploaded", () =>
        be.addInteraction(interactionHash_2, timestamp_2, individual_2, {from: institution_2})
        .then((rsl) => {
            var add = rsl.logs[0].args[0]; 
            assert.equal(add, individual_2);
            return be.getUploadedInteraction({from: institution_2});
        }).then((rsl) => {
            assert.equal(rsl[0]["interactionHash"], interactionHash_2, "incorrect interactionHash")
            assert.equal(rsl[0]["dateTime"], timestamp_2, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], institution_2, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], individual_2, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")            
        })
    );

    it("Institution: Should be able to view other institution's feedback", () =>
        be.registerIndividual(individual_2_name, {from: individual_2})
        .then(()=>{
            be.addFeedback(feedbackText_2, timestamp_2_feedback, institution_2, {from: individual_2})
        }).then((rsl) => {
            return be.getFeedback.call(institution_2, {from: institution_1});
        }).then((rsl) => {
            assert.equal(rsl[0]["id"], 0, "incorrect id")
            assert.equal(rsl[0]["text"], feedbackText_2, "incorrect feedback text")
            assert.equal(rsl[0]["dateTime"], timestamp_2_feedback, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], individual_2, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], institution_2, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")            
        })
    );

    it("Institution: Should not be able to invalidate interactions issued by other institutions", async () => {
        try {
            await be.invalidateInteraction(interactionHash_1, individual_1, {from: individual_4});
            assert.isTrue(false, 'interactions cannot be invalidated by other institution or individual');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only the recipient or issuer of interaction can invalidate it!',
                'other institution or recipient could still invalidate interactions');
        }
    });

    it("Non-Institution: Should not be able to upload interactions", async () => {
        try {
            await be.addInteraction(interactionHash_4, timestamp_4, individual_4, {from: institution_4});
            assert.isTrue(false, 'interactions cannot be uploaded by non non registered institution');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Institution is not registered!',
                'non registered Institution could still upload interactions');
        }
    });

    it("Non-Institution: Should not be able to get uploaded interactions", async () => {
        try {
            await be.getUploadedInteraction({from: institution_4});
            assert.isTrue(false, 'uploaded interactions cannot be viewed by non registered institutions');
        } catch (e) {
            var errorMessage = e['hijackedStack'].split('\n')[0]
            assert.strictEqual(
                errorMessage,
               'Error: Returned error: VM Exception while processing transaction: revert Institution is not registered!',
                'other non registered institution could still get uploaded interactions');
        }
    });
   
    it("Non-Institution: Should not be able to receive feedback", async () => {
        try {
            await be.getFeedback.call(individual_2, {from: individual_2});
            assert.isTrue(false, 'uploaded interactions cannot be viewed by non registered institutions');
        } catch (e) {
            var errorMessage = e['hijackedStack'].split('\n')[0]
            assert.strictEqual(
                errorMessage,
               'Error: Returned error: VM Exception while processing transaction: revert Institution is not registered!',
                'able to receive feedback even though address was not a registered institution');
        }
    });
    
    //Individual tests
    it("Individual: Should be able to register", () =>
        be.getName.call(individual_2)
        .then((rsl) => {
            assert.equal(rsl.valueOf(), individual_2_name, "incorrect registered individual's name");         
        })
    );

    it("Individual: Should be able to view interactions with instiutions", () =>
        be.getInteraction.call(individual_2, {from: individual_2})
        .then((rsl) => {
            assert.equal(rsl[0]["interactionHash"], interactionHash_2, "incorrect interactionHash")
            assert.equal(rsl[0]["dateTime"], timestamp_2, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], institution_2, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], individual_2, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")         
        })
    );
    
    it("Individual: Should be able to view institution's feedback", () =>
        be.getFeedback.call(institution_2, {from: individual_2})
        .then((rsl) => {
            assert.equal(rsl[0]["id"], 0, "incorrect id")
            assert.equal(rsl[0]["text"], feedbackText_2, "incorrect feedback text")
            assert.equal(rsl[0]["dateTime"], timestamp_2_feedback, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], individual_2, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], institution_2, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")       
        })
    );


    it("Individual: Should be able to add feedback on an institution", () =>
        be.addFeedback(feedbackText_2, timestamp_2_feedback, institution_2, {from: individual_2})
        .then((rsl) => {
            var event = rsl['logs'][0]['event'];
            var feedbackRecipient = rsl.logs[0].args[0]; 

            assert.equal(event, 'AddedFeedBack', "incorrect event emitted");
            assert.equal(feedbackRecipient, institution_2, "incorrect institution which received feedback");

            return be.getFeedback.call(institution_2, {from: institution_1});
        }).then((rsl) => {
            assert.equal(rsl[0]["id"], 0, "incorrect id")
            assert.equal(rsl[0]["text"], feedbackText_2, "incorrect feedback text")
            assert.equal(rsl[0]["dateTime"], timestamp_2_feedback, "incorrect dateTime")
            assert.equal(rsl[0]["issuer"], individual_2, "incorrect issuer") 
            assert.equal(rsl[0]["recipient"], institution_2, "incorrect recipient")  
            assert.equal(rsl[0]["isValid"], true, "incorrect valid state information")            
        })
    );

    it("Individual: Should be able to invalidate given feedback", () =>
        be.invalidateFeedback(0, institution_2, {from: individual_2})
        .then((rsl) => {
            var feedbackID = rsl.logs[0].args[0]; 
            var institution = rsl.logs[0].args[1];
            assert.equal(feedbackID, 0);
            assert.equal(institution, institution_2);
            return be.getFeedback.call(institution_2);
        }).then((rsl) => {
            assert.equal(rsl[0]["isValid"], false, "incorrect valid information of Feedback struct")
            return be.getAddedFeedback.call({from: individual_2});
        }).then((rsl) => {
            assert.equal(rsl[0]["isValid"], false, "incorrect valid information of Feedback struct")
        })
    );

    it("Individual: Should be able to invalidate given interaction", async () => {
        await be.registerIndividual(individual_3_name, {from: individual_3});
        await be.addInteraction(interactionHash_3, timestamp_3, individual_3, {from: institution_3});

        var log = await be.invalidateInteraction(interactionHash_3, individual_3, {from: individual_3});
        var eventEmitted = log['logs'][0]['event'];
        var hashInvalidated = log['logs'][0]['args']['0'];

        assert.equal(eventEmitted, 'InvalidateInteraction', 'incorrect event emitted');
        assert.equal(hashInvalidated, '0x3031303230333035000000000000000000000000000000000000000000000000', 'incorrect hash invalidated');
    });

    it("Individual: Should not be able to register an institution", async () => {
        try {
            await be.registerIndividual(institution_2_name, {from: institution_2});
            assert.isTrue(false, 'Institution cannot also be an Individual');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only unregistered users have access to this function!',
                'Institution cannot also be an Individual'
            )
        }
    });

    it("Individual: Should not be able to register the contract owner", async () => {
        try {
            await be.registerIndividual(contractOwner_name, {from: contractOwner});
            assert.isTrue(false, 'Institution cannot also be an Individual');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only unregistered users have access to this function!',
                'Institution cannot also be an Individual'
            )
        }
    });

    
    it("Individual: Should not be able to add feedback on an institution, if you did not previously have an interaction with that institution", async () => {
        try {
            await  be.addFeedback(feedbackText_2, timestamp_2_feedback, institution_1, {from: individual_2});
            assert.isTrue(false, 'feedback cannot be addded by an individual if it did not previously have an interaction with that institution');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only users with previous interactions can access this function!',
                'all users could add feedback on an institution');
        }
    });

    it("Individual: Should not be able to invalidate other individual's feedback", async () => {
        try {
            await  be.invalidateFeedback(0, institution_2, {from: individual_1});
            assert.isTrue(false, 'feedback cannot be invalidated by an individual if it did not previously have an feedback with that institution');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only the feedback issuer has access to this function!',
                'all users could invalidate other individual feedback');
        }
    });

    it("Individual: Should not be able to invalidate other individual's interaction", async () => {
        await be.registerInstitution(institution_4, institution_4_name, {from: institution_1});
        await be.addInteraction(interactionHash_4, timestamp_4, individual_4, {from: institution_4});
        try {
            await be.invalidateInteraction(interactionHash_4, individual_4, {from: individual_3});
            assert.equal(true, false, 'all users could invalidate other interactions of other individuals');
        } catch (e) {
            assert.strictEqual(
                e.reason,
                'Only the recipient or issuer of interaction can invalidate it!',
                'all users could invalidate other interactions of other individuals');
        }
    });

    //General tests
    it("General: Should be able to check an individual's identity type", () =>
        be.checkUserIdentity.call(individual_2)
        .then((rsl) => {
            assert.equal(Number(rsl), 1, "incorrect registered individual's identity type");         
        })
    );

    it("General: Should be able to check an insitution's identity type", () =>
        be.checkUserIdentity.call(institution_3)
        .then((rsl) => {
            assert.equal(Number(rsl), 2, "incorrect registered institution's identity type");         
        })
    );

    it("General: Should be able to check the contract owner's identity type", () =>
        be.checkUserIdentity.call(contractOwner)
        .then((rsl) => {
            assert.equal(Number(rsl), 3, "incorrect registered owner's identity type");         
        })
    );

    it("General: Should be able to get the name of an address", () =>
        be.getName(institution_3)
        .then((rsl) => {
            assert.equal(rsl.valueOf(), institution_3_name, "name if wrong");
        })
    );
    
});

