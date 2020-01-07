//Pseudocode for the Decentralized Identifier and DID Document functionalities

interface PublicKey {
    "id" : string,
    "type" : string,
    "controller" : string
    //Optional keyparameters to list the public key
}

interface Authentication {
    //Further research
}

interface Service {
    "id" : string,
    "type" : string,
    "serviceEndpoint" : string
}

//Contains all the fields of the DID Standard for the DID Document
interface DIDDocument {
    "@context" : string[],
    "id" : string,
    "controller" ?: string,
    "publicKey" ?: PublicKey[],
    "authentication" ?: Authentication[],
    "service" ?: Service[]
}

//
function GenerateDIDDocument() : DIDDocument {
    return;
}