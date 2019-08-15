import { VerifiableCredential } from "./VerifiableCredentail";
import { DIDDocument } from "../DID/DIDDocument";
import { RSAKeypair } from "../Encryption/RSAKeypair";

export enum ProofTypes {
    RSA = "RsaSignature2018"
}

export function CreateRSAProof(credentialToSign : VerifiableCredential, issuerDID : DIDDocument, issuerKeyId : string) : string {
    let keypair : RSAKeypair = issuerDID.GetEncryptionKeypair(issuerKeyId);
    return keypair.Sign(JSON.stringify(credentialToSign.GetCredential()));
}

export function VerifyRSAProof(credentialToVerify : VerifiableCredential, issuerDID : DIDDocument, issuerKeyId : string) {
    let keypair : RSAKeypair = issuerDID.GetEncryptionKeypair(issuerKeyId);
    return keypair.Verify(JSON.stringify(credentialToVerify.GetCredential()), credentialToVerify.GetProof());
}