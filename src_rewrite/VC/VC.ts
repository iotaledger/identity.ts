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
    "credentailStatus" : CredentialStatus[],
    "credentialSchema" ?: CredentialSchema[],
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