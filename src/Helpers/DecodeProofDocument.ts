import { ExtendedProofDocument, ProofParameters } from "../VC/Proof/Proof";
import { DIDDocument } from "../DID/DIDDocument";
import { DID } from "../DID/DID";

export async function DecodeProofDocument(proofDocument : ExtendedProofDocument, provider : string) : Promise<ProofParameters> {
    return new Promise<ProofParameters> ((resolve, reject) => {
        DIDDocument.readDIDDocument( provider, new DID(proofDocument.creator).GetUUID())
        .then((issuerDID) => {
            resolve({
                'issuer' : issuerDID,
                'issuerKeyId' : new DID(proofDocument.verificationMethod).GetFragment(),
                'challengeNonce' : proofDocument.nonce
            });
        }).catch((err: Error) => {console.log(err);reject(err)});
    }); 
}