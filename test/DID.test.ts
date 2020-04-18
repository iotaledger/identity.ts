import { expect } from 'chai';
import 'mocha';
import { delay, provider, depth, mwm, TestProofTypes } from './test.settings';
import { CreateRandomDID } from '../src/Helpers/CreateRandomDID';
import { BaseKeypair } from '../src/Encryption/BaseKeypair';
import { DID } from '../src/DID/DID';
import { Hash } from '../src/Encryption/Hash';
import { DIDDocument } from '../src/DID/DIDDocument';
import { DIDPublisher } from '../src/IOTA/DIDPublisher';
import { GenerateSeed } from '../src/Helpers/GenerateSeed';
import { Service } from '../src/DID/Service';

for(let i=0; i<TestProofTypes.length;i++) {
    describe('DID Functionalities with ' + TestProofTypes[i].name, function() {
        let uuid : string;
        it('Should create a valid DID from a UUID', async function() {
            let keypair : BaseKeypair = await TestProofTypes[i].keyGenFunc();
            uuid = Hash(keypair.GetPublicKey());
            expect("did:iota:main:"+uuid, new DID(uuid).GetSpecificDID());
        });
    
        it('Should create a valid DID from a did:method:uuid', async function() {
            expect("did:iota:main:"+uuid, new DID("did:iota:"+uuid).GetSpecificDID());
        });
    
        it('Should create a valid DID from a did:method:network:uuid', async function() {
            expect("did:iota:dev:"+uuid, new DID("did:iota:dev:"+uuid).GetSpecificDID());
        });
    
        it('Should create a valid DID from a did:method:network:uuid#fragment', async function() {
            let did : DID = new DID("did:iota:dev:"+uuid + "#fragment");
            expect("did:iota:dev:"+uuid, did.GetSpecificDID());
            expect("fragment", did.GetFragment());
        });
    });

    describe('DID Document with ' + TestProofTypes[i].name, function() {
        let document : DIDDocument;
        let seed : string = GenerateSeed();
        let root : string;
        let documentFromTangle : DIDDocument;
        let publisher : DIDPublisher;
        let service : Service;
    
        it('Should create and output a valid DID Document', async function(){
            document = await CreateRandomDID(seed);
            let keypair : BaseKeypair = await TestProofTypes[i].keyGenFunc();
            document.AddKeypair(keypair, "keys-1");
            expect(document.GetJSONDIDDocument()).to.not.be.undefined;
        });
    
        it('Should publish the DID Document', async function() {
            this.timeout(60000);
            publisher = new DIDPublisher(provider, seed);
            root = await publisher.PublishDIDDocument(document, "DIDTEST", mwm, depth)
            expect(root).to.not.be.undefined;
        });
    
        it('Should read the same document from the Tangle', async function() {
            this.timeout(60000);
            await delay(2000); //Sleep prevents the node to not know about the first tx yet, failing the test.
            documentFromTangle = await DIDDocument.readDIDDocument(provider, root);
            expect(documentFromTangle.GetJSONDIDDocument()).to.deep.equal(document.GetJSONDIDDocument());
        });
    
        //Known poorly implemented test
        /*it('Should handle empty DID Documents', async function() {
            const result = await DIDDocument.readDIDDocument(provider, GenerateSeed(81));
        });*/
    
        it('Should Sign locally and Verify from loaded DID Document', async function() {
            let msg : string = "Hello World";
            let signature : Buffer = await document.GetKeypair("keys-1").GetEncryptionKeypair().Sign(msg);
            expect(await documentFromTangle.GetKeypair("keys-1").GetEncryptionKeypair().Verify(msg, signature)).to.be.true;
        });
    
        it('Should add a ServiceEndpoint', function() {
            service = new Service(document.GetDID(), "test", "TestService", GenerateSeed());
            document.AddServiceEndpoint(service);
            expect(document.GetService("test")).to.not.be.null;
        });
    
        it('Should update the DIDDocument correctly and contain a ServiceEndpoint', async function() {
            this.timeout(60000);	
            await publisher.PublishDIDDocument(document, "DIDTEST", mwm, depth);
            documentFromTangle = await DIDDocument.readDIDDocument(provider, root);
            expect(documentFromTangle.GetJSONDIDDocument()).to.deep.equal(document.GetJSONDIDDocument());
            expect(documentFromTangle.GetService("test").EncodeToJSON()).to.deep.equal(service.EncodeToJSON());
        });
    });
}