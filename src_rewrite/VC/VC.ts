//Pseudocode for the Verifiable Credentials 


interface VerifiableCredential {
    "contexts" : string[],
    "id" ?: string,
    "type" : string[],
    "credentialSubject" : CredentialSubject[],
    "issuer" : string | Issuer[],
    "issuanceDate" : string,
    "proof" : Proof[],
    "expirationDate" ?: string,
    "credentialStatus" : CredentialStatus[],
    "credentialSchema" ?: CredentialSchema[],
    "refreshService" ?: RefreshService[],
    "termsOfUse" ?: TermsOfUse[],
    "evidence" ?: Evidence[]
}

interface DerivedVerifiableCredential {
    "contexts" : string[],
    "id" ?: string,
    "type" : string[],
    "credentialSubject" : CredentialSubject[],
    "issuer" : string | Issuer[],
    "issuanceDate" : string,
    //Privacy preserving proof
    "proof" : Proof[],
    "expirationDate" ?: string,
    "credentialStatus" : CredentialStatus[],
    //Requires credentialSchema
    "credentialSchema" : CredentialSchema[],
    "refreshService" ?: RefreshService[],
    "termsOfUse" ?: TermsOfUse[],
    "evidence" ?: Evidence[]

}

interface VerifiablePresentation {
    "contexts" : string[],
    "id" ?: string,
    "type" : string[],
    "verifiableCredential" ?: VerifiableCredential[],
    "holder" ?: string,
    "proof" ?: Proof[],
    "refreshService" ?: RefreshService[],
    "termsOfUse" ?: TermsOfUse[]
}

interface CredentialSubject {
    //Research: Array or not?!
}

interface Issuer {
    "id" : string,
    "name" ?: string
}


interface Proof {
    "type" : string
    //Get from Jelle's code
}

//current status (suspended/revoked...)
interface CredentialStatus {
    "id" : string,
    "type" : string
}

//verifiers to check if data confirms to schema
interface CredentialSchema {
    "id": string,
    "type": string
}

//Refreshing of expired VCs
interface RefreshService {
    "id": string, 
    "type": string
}

//Policies of usage
interface TermsOfUse {
    "type": string,
    "id" ?: string
}

//additional supporting information
interface Evidence {
    "type": string,
    "id" ?: string
}


async function verifyVerifiableCredential( verifiableCredential: VerifiableCredential, proof: Proof ) : Promise<boolean> {
    return;
}

function signVerifiableCredential ( privateKey: PrivateKey, verifiableCredential: VerifiableCredential  ) : Proof {
    return; 
}

async function revokeVerifiableCredential ( verifiableCredential: VerifiableCredential  ) : Promise<void> {
    return; 
}

async function refreshVerifiableCredential ( verifiableCredential: VerifiableCredential ) : Promise<void> {
    return; 
}

//Get all verifiable credentials from verifiable presentation 
function getAllVerifiableCredentials ( verifiablePresentation: VerifiablePresentation ) : VerifiableCredential {
    return;
}

function createDerivedVerifiableCredential ( verifiableCredential: VerifiableCredential, CredentialSchema: CredentialSchema ) : DerivedVerifiableCredential {
    return; 
}

// Helper functions for verification

//Check for whitelisted DID
async function checkTrustfulness ( verifiableCredential: VerifiableCredential ) : Promise<boolean> {
    return;
}

async function checkSchema ( verifiableCredential: VerifiableCredential, credentialSchema: CredentialSchema ) : Promise<boolean> {
    return;
}

async function verifySignature( proof: Proof ) : Promise<boolean> {
    return;
}

//Check if revoked or expired
async function checkStatus ( credentialStatus: CredentialStatus  ) : Promise<boolean> {
    return;
}

