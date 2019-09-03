//DID
export { DID } from './DID/DID';
export { DIDDocument } from './DID/DIDDocument';

//Encryption
export { BaseKeypair } from './Encryption/BaseKeypair';
export { Hash } from './Encryption/Hash';
export { RSAKeypair } from './Encryption/RSAKeypair';

//Helpers
export { CreateRandomDID, CreateRandomDIDFromPublicKey} from './Helpers/CreateRandomDID';
export { DecodeProofDocument } from './Helpers/DecodeProofDocument';
export { SignDIDAuthentication, VerifyDIDAuthentication } from './Helpers/DIDAuthentication';
export { GenerateRSAKeypair } from './Helpers/GenerateKeypair';
export { GenerateSeed } from './Helpers/GenerateSeed';

//IOTA
export { DIDPublisher } from './IOTA/DIDPublisher';
export { MAMSettings, MAMState, MAM_MODE} from './IOTA/mam';

//VC - Proofs
export { Proof, ExtendedProofDocument, ProofBuildingMethod, SigningMethod, VerifySignatureMethod, ProofParameters } from './VC/Proof/Proof';
export { ProofTypeManager } from './VC/Proof/ProofTypeManager';
export { BuildRSAProof, RSAProofDocument } from './VC/Proof/RSAProof';
//VC
export { Credential, CredentialDataModel } from './VC/Credential';
export { Presentation, PresentationDataModel } from './VC/Presentation';
export { Schema } from './VC/Schema';
export { SchemaManager } from './VC/SchemaManager';
export { VerifiableCredential, VerifiableCredentialDataModel } from './VC/VerifiableCredential';
export { VerificationErrorCodes } from './VC/VerifiableObject';
export { VerifiablePresentation, VerifiablePresentationDataModel } from './VC/VerifiablePresentation';