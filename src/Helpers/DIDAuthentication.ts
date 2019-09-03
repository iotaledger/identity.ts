import { DIDDocument } from './../DID/DIDDocument';
import { Credential } from './../VC/Credential';
import { SchemaManager } from '../VC/SchemaManager';
import { BuildRSAProof } from './../VC/Proof/RSAProof';
import { VerifiableCredential } from './../VC/VerifiableCredential';
import { Presentation } from './../VC/Presentation';
import { VerifiablePresentation, VerifiablePresentationDataModel } from './../VC/VerifiablePresentation';
import { DecodeProofDocument } from './DecodeProofDocument';

export function SignDIDAuthentication(document : DIDDocument, keyId : string, challenge : string) : VerifiablePresentation {
    const credential = Credential.Create(SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential"), document.GetDID(), {"DID" : document.GetDID().GetDID() });
    const proof = BuildRSAProof({issuer:document, issuerKeyId:keyId, challengeNonce:challenge});
    proof.Sign(credential.EncodeToJSON());
    const VC =  VerifiableCredential.Create(credential, proof);
    const presentation = Presentation.Create([VC]);
    const presentationProof = BuildRSAProof({issuer:document, issuerKeyId:keyId, challengeNonce:challenge});
    presentationProof.Sign(presentation.EncodeToJSON());
    return VerifiablePresentation.Create(presentation, presentationProof);
}

export async function VerifyDIDAuthentication(presentationData : VerifiablePresentationDataModel, provider : string) {
    const proofParameters = await DecodeProofDocument(presentationData.proof, provider);
    const verifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(proofParameters.issuer.GetDID());
    const code = verifiablePresentation.Verify();
    SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(proofParameters.issuer.GetDID());
    return code;
}