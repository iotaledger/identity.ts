import { DIDDocument } from './../DID/DIDDocument';
import { Credential } from './../VC/Credential';
import { SchemaManager } from '../VC/SchemaManager';
import { BuildRSAProof } from './../VC/Proof/RSAProof';
import { VerifiableCredential } from './../VC/VerifiableCredential';
import { VerifiablePresentation, VerifiablePresentationDataModel } from './../VC/VerifiablePresentation';
import { DecodeProofDocument } from './DecodeProofDocument';

export function SignDIDAuthentication(document : DIDDocument, keyId : string, challenge : string) : VerifiableCredential {
    const credential = Credential.Create(SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential"), document.GetDID(), {"DID" : document.GetDID().GetDID() });
    const proof = BuildRSAProof({issuer:document, issuerKeyId:keyId, challengeNonce:challenge});
    proof.Sign(credential.EncodeToJSON());
    const VC =  VerifiableCredential.Create(credential, proof);
    return VC;
}

export async function VerifyDIDAuthentication(presentationData : VerifiablePresentationDataModel, provider : string) : Promise<void> {
    return new Promise<void>( async (resolve, reject) => {
        const proofParameters = await DecodeProofDocument(presentationData.proof, provider);
        const verifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);
        SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(proofParameters.issuer.GetDID());
        verifiablePresentation.Verify(provider)
        .then(() => {
            resolve();
        })
        .catch((err : Error) => {
            reject(err);
        })
        .finally(() => {
            SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(proofParameters.issuer.GetDID());
        });
    });
}