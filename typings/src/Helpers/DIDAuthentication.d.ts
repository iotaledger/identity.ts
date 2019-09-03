import { DIDDocument } from './../DID/DIDDocument';
import { VerifiablePresentation, VerifiablePresentationDataModel } from './../VC/VerifiablePresentation';
export declare function SignDIDAuthentication(document: DIDDocument, keyId: string, challenge: string): VerifiablePresentation;
export declare function VerifyDIDAuthentication(presentationData: VerifiablePresentationDataModel, provider: string): Promise<import("..").VerificationErrorCodes>;
