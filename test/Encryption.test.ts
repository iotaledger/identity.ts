import { expect } from 'chai';
import 'mocha';
import { TestProofTypes } from './test.settings';
import { BaseKeypair } from '../src/Encryption/BaseKeypair';
import { RecursiveSort } from '../src/Helpers/RecursiveSort';

const msg: string = "Hello World";

const UnsortedObject = [{
    "id": [{
        "did": "did",
    }, {
        "uuid": "ebfeb1f712ebc6f1c276e12ec21",
        "method": "example"
    }],
    "name": {
        "surname": "Doe",
        "firstname": "Jayden"
    },
    "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
}, {
    "name": {
        "firstname": "Morgan",
        "surname": "Doe"
    },
    "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "id": [{
        "did": "did",
    }, {
        "method": "example",
        "uuid": "c276e12ec21ebfeb1f712ebc6f1"
    }]
}];

for(let i=0; i<TestProofTypes.length;i++) {
    describe(TestProofTypes[i].name + ' Encryption', function () {
        let keypair: BaseKeypair;
    
        it('Should generate a keypair', async function () {
            keypair = await TestProofTypes[i].keyGenFunc();
            expect(keypair).to.not.be.undefined;
        });
        
        it('Should encrypt->decrypt to reveal the same message', async function () {
            let encryptedMsg: Buffer = keypair.PublicEncrypt(msg);
            expect(keypair.PrivateDecrypt(encryptedMsg)).to.deep.equal(msg);
        });

        it('Should Sign and correctly verify msg', async function () {
            let signature: Buffer = keypair.Sign(msg);
            expect(keypair.Verify(msg, signature)).to.be.true;
        });

        it('Should Sign and catch the change', async function () {
            let signature: Buffer = keypair.Sign(msg);
            expect(keypair.Verify("Another message", signature)).to.be.false;
        });

        it('Should Sign and Verify correctly after doing a base64 encoding', async function () {
            let signature: Buffer = keypair.Sign(msg);
            let stringSignature: string = signature.toString("base64");
            let signatureBuffer: Buffer = Buffer.from(stringSignature, "base64");
            expect(keypair.Verify(msg, signatureBuffer)).to.be.true;
        });
    });

    describe('Recursive Sorting ' + TestProofTypes[i].name, function() {
        let SortedObject = [{
            "id": [{
                "did": "did",
            }, {
                "method": "example",
                "uuid": "ebfeb1f712ebc6f1c276e12ec21"
            }],
            "name": {
                "firstname": "Jayden",
                "surname": "Doe"
            },
            "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
        }, {
            "id": [{
                "did": "did",
            }, {
                "method": "example",
                "uuid": "c276e12ec21ebfeb1f712ebc6f1"
            }],
            "name": {
                "firstname": "Morgan",
                "surname": "Doe"
            },
            "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21"
        }];

        let PostSorting = RecursiveSort(UnsortedObject);
        let keypair: BaseKeypair;

        before(async function () {
            keypair = await TestProofTypes[i].keyGenFunc();
        });

        it('Should sort the document correctly', function () {
            expect(SortedObject).to.deep.equal(PostSorting);
        });

        //Known Issue
        /*it('Should not match signatures when scrambled', function () {
            expect(keypair.Sign(JSON.stringify(SortedObject))).to.not.deep.equal(keypair.Sign(JSON.stringify(UnsortedObject)));
        });*/
        
        it('Should match signatures even when first scrambled and then sorted', function () {
            expect(keypair.Sign(JSON.stringify(SortedObject))).to.deep.equal(keypair.Sign(JSON.stringify(PostSorting)));
        });
    });
}