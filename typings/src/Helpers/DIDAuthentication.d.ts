import { DIDDocument } from './../DID/DIDDocument';
import { VerifiableCredential } from './../VC/VerifiableCredential';
import { VerifiablePresentationDataModel } from './../VC/VerifiablePresentation';
import { VerificationErrorCodes } from '../VC/VerifiableObject';
export declare function SignDIDAuthentication(document: DIDDocument, keyId: string, challenge: string): VerifiableCredential;
export declare function VerifyDIDAuthentication(presentationData: VerifiablePresentationDataModel, provider: string): Promise<VerificationErrorCodes>;
