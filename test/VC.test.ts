import { expect } from 'chai';
import 'mocha';
import { delay, provider, TestProofTypes } from './test.settings';
import { Credential } from '../src/VC/Credential';
import { VerifiableCredential } from '../src/VC/VerifiableCredential';
import { SchemaManager } from '../src/VC/SchemaManager';
import { DIDDocument, SignDIDAuthentication, VerifyDIDAuthentication, BaseKeypair } from '../src';
import { CreateRandomDID } from '../src/Helpers/CreateRandomDID';
import { DIDPublisher } from '../src/IOTA/DIDPublisher';
import { GenerateSeed } from '../src/Helpers/GenerateSeed';
import { Presentation } from '../src/VC/Presentation';
import { VerifiablePresentation } from '../src/VC/VerifiablePresentation';
import { VerificationErrorCodes } from '../src/VC/VerifiableObject';
import { Proof, ProofBuildingMethod, ProofParameters } from '../src/VC/Proof/Proof';
import { ProofTypeManager } from '../src/VC/Proof/ProofTypeManager';
import { DecodeProofDocument } from '../src/Helpers/DecodeProofDocument';

for(let i=0; i<TestProofTypes.length;i++) {
    describe(TestProofTypes[i].name + " Signed Credentials", async function() {
        let IssuerDIDDocument : DIDDocument;
        let issuerSeed : string;
        let issuerPrivateKey : string;
        let SubjectDIDDocument : DIDDocument;
        let subjectSeed : string;

        let credential : Credential;
        let verifiableCredential : VerifiableCredential;
        let proofMethod : ProofBuildingMethod;
        let VCProof : Proof;
        let presentation : Presentation;
        let verifiablePresentation : VerifiablePresentation;
        let presentationProof : Proof;

        before(async function() {
            this.timeout(30000);
            //Generate an issuer
            issuerSeed = GenerateSeed();
            IssuerDIDDocument = CreateRandomDID(issuerSeed);
            let keypair : BaseKeypair = await TestProofTypes[i].keyGenFunc();
            issuerPrivateKey = keypair.GetPrivateKey();
            IssuerDIDDocument.AddKeypair(keypair, "keys-1");
            let publisher : DIDPublisher = new DIDPublisher(provider, issuerSeed);
            await publisher.PublishDIDDocument(IssuerDIDDocument, "DIDTEST", 9);
            SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate").AddTrustedDID(IssuerDIDDocument.GetDID());
            //Generate a Subject
            subjectSeed = GenerateSeed();
            SubjectDIDDocument = CreateRandomDID(subjectSeed);
            let keypair2 : BaseKeypair = await TestProofTypes[i].keyGenFunc();
            SubjectDIDDocument.AddKeypair(keypair2, "keys-1");
            let publisher2 : DIDPublisher = new DIDPublisher(provider, subjectSeed);
            await publisher2.PublishDIDDocument(SubjectDIDDocument, "DIDTEST", 9);
            proofMethod = ProofTypeManager.GetInstance().GetProofBuilder(TestProofTypes[i].name);
        });
    
        it('Should be able to a credential', function() {
            let domainCertificate = {
                id : SubjectDIDDocument.GetDID().GetDID(),
                domains : [
                    "blog.iota.org",
                    "coordicide.iota.org",
                    "docs.iota.org"
                ]
            };
            credential = Credential.Create(SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate"), IssuerDIDDocument.GetDID(), domainCertificate);
            expect(credential.GetCredential()).to.not.be.undefined;
        });
    
        it('Should be able to Encode / Decode a credential to be the same', function() {
            let importedCredential : Credential = Credential.DecodeFromJSON(credential.EncodeToJSON());
            expect(importedCredential.EncodeToJSON()).to.deep.equal(credential.EncodeToJSON());
        });
    
        it('Should be able to create, sign and verify a Verifiable Credential' , function() {
            VCProof = proofMethod({'issuer' : IssuerDIDDocument, 'issuerKeyId' : "keys-1"});
            VCProof.Sign(credential.EncodeToJSON());
            verifiableCredential = VerifiableCredential.Create(credential, VCProof);
            expect(verifiableCredential.Verify()).to.deep.equal(VerificationErrorCodes.SUCCES);
        });
    
        it('Should be able to Encode / Decode a Verifiable Credential and still verify', async function() {
            this.timeout(80000);
            await delay(2000);
            let proofParameters : ProofParameters = await DecodeProofDocument(verifiableCredential.EncodeToJSON().proof, provider);
            let importedVerifiableCredential : VerifiableCredential = VerifiableCredential.DecodeFromJSON(verifiableCredential.EncodeToJSON(), proofParameters);
            expect(importedVerifiableCredential.Verify()).to.deep.equal(VerificationErrorCodes.SUCCES);
            expect(importedVerifiableCredential.EncodeToJSON()).to.deep.equal(verifiableCredential.EncodeToJSON());
        });
    
        it('Should test all Verification Error codes for Verifiable Credentials', function() {
            
        });
    
        it('Should be able to create a presentation from a Verifiable Credential', function() {
            presentation = Presentation.Create([verifiableCredential]);
            expect(presentation.EncodeToJSON().verifiableCredential[0]).to.deep.equal(verifiableCredential.EncodeToJSON());
        });
    
        it('Should be able to Encode / Decode a presentation to be the same', async function() {
            let importPresentation : Presentation = await Presentation.DecodeFromJSON(presentation.EncodeToJSON(), provider);
            expect(importPresentation.EncodeToJSON()).to.deep.equal(presentation.EncodeToJSON());
        });
    
        it('Should be able to create, sign and verify the Verifiable Presentation', function() {
            presentationProof = proofMethod({'issuer' : SubjectDIDDocument, 'issuerKeyId' : "keys-1", challengeNonce : "123"});
            presentationProof.Sign(presentation.EncodeToJSON());
            verifiablePresentation = VerifiablePresentation.Create(presentation, presentationProof);
            expect(verifiablePresentation.Verify()).to.deep.equal(VerificationErrorCodes.SUCCES);
        });
    
        //verifiablePresentation Shouldn't this be enough to integrate into VerifiableObject and do DecodeProofDocument?
        it('Should be able to Encode / Decode a Verifiable Presentation and still verify', async function() {
            let proofParameters : ProofParameters = await DecodeProofDocument(verifiablePresentation.EncodeToJSON().proof, provider);
            let importVerifiablePresentation : VerifiablePresentation = await VerifiablePresentation.DecodeFromJSON(verifiablePresentation.EncodeToJSON(), provider, proofParameters);
            expect(importVerifiablePresentation.Verify()).to.deep.equal(VerificationErrorCodes.SUCCES);
            expect(importVerifiablePresentation.EncodeToJSON()).to.deep.equal(verifiablePresentation.EncodeToJSON());
        });
    
        it('Should test all Verification Error codes for Verifiable Presentation', function() {
    
        });
    
        let DIDAuth : VerifiablePresentation;
        it('Should create a DID Authentication Verifiable Presentation', function() {
            const DIDAuthVC = SignDIDAuthentication(SubjectDIDDocument, "keys-1", GenerateSeed(12));
            const presentation = Presentation.Create([DIDAuthVC]);
            const presentationProof =  ProofTypeManager.GetInstance().CreateProofWithBuilder(TestProofTypes[i].name, {issuer:SubjectDIDDocument, issuerKeyId:"keys-1", challengeNonce:GenerateSeed(12)});
            presentationProof.Sign(presentation.EncodeToJSON());
            DIDAuth = VerifiablePresentation.Create(presentation, presentationProof);
            SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(SubjectDIDDocument.GetDID());
            expect(DIDAuth.Verify()).to.deep.equal(VerificationErrorCodes.SUCCES);
            SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(SubjectDIDDocument.GetDID());
            expect(DIDAuth.GetVerifiedTypes()).to.deep.equal(["DIDAuthenticationCredential"]);
        });
    
        it('Should be able to verify an imported DID Authentication', async function() {
            expect(await VerifyDIDAuthentication(DIDAuth.EncodeToJSON(), provider)).to.deep.equal(VerificationErrorCodes.SUCCES);
        });
    });
}