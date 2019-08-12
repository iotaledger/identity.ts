import { expect } from 'chai';
import 'mocha';
import { CreateRandomDID } from '../src/Helpers/CreateRandomDID';
import { GenerateRSAKeypair } from '../src/Helpers/GenerateKeypair';
import { RSAKeypair } from '../src/Encryption/RSAKeypair';
import { DID } from '../src/DID/DID';
import { Hash } from '../src/Encryption/Hash';
import { DIDDocument } from '../src/DID/DIDDocument';
import { DIDPublisher } from '../src/IOTA/DIDPublisher';
import { GenerateSeed } from '../src/Helpers/GenerateSeed';

const provider : string = "https://nodes.devnet.iota.org:443";

describe('DID Functionalities', function() {
    let uuid : string;
    it('Should create a valid DID from a UUID', async function() {
        let keypair : RSAKeypair = await GenerateRSAKeypair();
        uuid = Hash(keypair.GetPublicKey());
        expect("did:iota:main:"+uuid, new DID(uuid).GetSpecificDID());
    });

    it('Should create a valid DID from a did:method:uuid', async function() {
        expect("did:iota:main:"+uuid, new DID("did:iota:"+uuid).GetSpecificDID());
    });

    it('Should create a valid DID from a did:method:network:uuid', async function() {
        expect("did:iota:dev:"+uuid, new DID("did:iota:dev:"+uuid).GetSpecificDID());
    });

});


describe('DID Document', function() {
    let document : DIDDocument;
    let seed : string = GenerateSeed();
    let root : string;

    it('Should create and output a valid DID Document', async function(){
        document = await CreateRandomDID("keys-1");
        expect(
            {
                "@contect" : [
                    "https://www.w3.org/2019/did/v1"
                ],
                "id" : document.GetDID().GetDID(),
                "publicKey" : [
                    document.GetJSONDIDDocument()
                ]
            }, document.GetJSONDIDDocument()
        )
    });

    it('Should publish the DID Document', async function() {
        this.timeout(20000);
        let publisher : DIDPublisher = new DIDPublisher(provider, seed);
        root = await publisher.PublishDIDDocument(document, "DIDTEST", 9)
        expect(root).to.not.be.undefined;
    });

    it('Should read the same document from the Tangle', async function() {
        this.timeout(20000);
        await delay(1000); //Sleep prevents the node to not know about the first tx yet, failing the test.
        let documentFromTangle : DIDDocument = await DIDDocument.readDIDDocument(provider, root);
        expect(documentFromTangle.GetJSONDIDDocument()).to.deep.equal(document.GetJSONDIDDocument());
    });
});

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}