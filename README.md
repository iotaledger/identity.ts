# Identity.ts 

This is a work-in-progress library for Digital Identity on IOTA. It follows the Decentralized Identifiers (DIDs) v0.13 and Verifiable Credentials standards created by the W3C Community Group. 
The concept of digital identity allows people, businesses, devices and anything else to identify themselves online, while remaining fully in control of this process. 
For people, the term self-sovereign identity has been coined, which correctly suggests the return of control over their own personal data. 
A digital identity can be used for online identification, removing the need for hundreds of accounts, but also to prove more information about the subject of the identity. 
For example, a user would be able to prove that he is above the legal drinking age, allowing them to purchase alcohol online. 
This information is instantly verifiable by the online vendor.

**WARNING: THE CURRENT VERSION IS FEATURE INCOMPLETE AND WILL STILL UNDERGO MASSIVE CHANGES**
If you are interested in using this project or contributing, join our [Discord](https://discord.iota.org) and visit the channel #digital-id. 

## Prerequisits

Node v10+

## Decentralized Identifers (DID)

This DID implementation is based on [v0.13 of the DID specification from W3C](https://w3c-ccg.github.io/did-spec/).
DID's are the most common standard for Digital Identity platforms based on Distributed Ledger Technology (DLT). 
In order to understand their relevance, please [read the explanation on the specification page](https://w3c-ccg.github.io/did-spec/#introduction).
In short, DIDs provide a unique identifier on the IOTA network, that is managed by the owner of the identifier. 
They can be authenticated using the [DID-Authentication protocol](https://github.com/WebOfTrustInfo/rwot6-santabarbara/blob/master/final-documents/did-auth.md), which proves to an inspection party that they are communicating with the owner of the DID.
[According to the DID specification](https://w3c-ccg.github.io/did-spec/#did-documents) a DID Document is outputted when a DID is resolved. 
This DID Document may be stored on IOTA, however this is immutabily stored and **might** contain personal data according to the GDPR. 
It is therefore recommended that any DID's that represent people, will not be published on the Tangle, while issueing entities and devices should publish these to IOTA. 

To create, retrieve and manage DID Documents look at the [DID Documention](src/DID/README.md).

## Verifiable Credentials 

Verifiable Credentials are implemented according to the [Verifiable Credentials Data Model 1.0 by W3C Community Group](https://www.w3.org/TR/vc-data-model/) standard.
Verifiable Credentials works closely together with the DID standard. Where a DID can just be authenticated, Verifiable Credentials can add verifiable attributes to the identifier. 
The acquisition, communication, management and storage of Verifiable Credentials are out of the scope of this implementation. 
For a general introduction to the concept, please [read the explanation on the specification page](https://www.w3.org/TR/vc-data-model/#what-is-a-verifiable-credential).
In short, a verifiable credential is a statement from an issuer that the DID of the subject has certain attributes. The subject can share this credential to other parties who can verify the integrity and authenticity of the credential. 
The credentials are cryptographically signed by the DID of the issuer. 

To create and verify Verifiable Credentials look at the [Verifiable Credentials Documentation](src/VC/README.md).

## Verifiable Presentations

In order to communicate acquired Verifiable Credentials with an inspection party, the subject needs to cryptographically sign the credential with a challenge. This is done to prevent a replay-attack where another party can also pass on the credential as if it is talking about their DID. This is done in the [Verifiable Presentation data model](https://www.w3.org/TR/vc-data-model/#presentations), which groups a set of excisting Verifiable Credentials of the subject together for the inspecting party and adds a signature, including a challenge from the inspecting party. It is therefore required to not communicate credentials directly, but rather presentations.

## Schematics of Credentials

TODO: Describe schematics

## Encryption techniques

TODO: Describe current Encryption techniques and wanted / planned techniques.

## Future of this project

TODO: Write about the goals

## API Reference

TODO: Add Module overview

