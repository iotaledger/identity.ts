import { VerifiableCredentialDataModel, VerifiableCredential } from "./VerifiableCredential";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
import { DID } from "../DID/DID";
import { DIDDocument } from "../DID/DIDDocument";

export interface PresentationDataModel {
    "@context" : string[],
    type : string[],
    holder ?: string,
    verifiableCredential: VerifiableCredentialDataModel[]
}

export class Presentation extends BaseValidationObject {
    private verifiableCredentials : VerifiableCredential[];
    private holder : DID;

    public static Create(verifiableCredentials : VerifiableCredential[], presentationSchema ?: Schema, context : string = "iota.org") : Presentation {
        return new Presentation(verifiableCredentials, presentationSchema, context);
    }

    public static DecodeFromJSON(presentationData : PresentationDataModel, provider : string, presentationSchema ?: Schema) : Promise<Presentation> {
        return new Promise<Presentation> (async(resolve, reject) => {
            let verifiableCredentials : VerifiableCredential[] = [];
            let context : string = presentationData["@context"][1];
            for(let i=0; i < presentationData.verifiableCredential.length; i++) {
                //TODO: Check if VerificationMethod & IssuerDID are the same?
                let issuerDID : DID = new DID(presentationData.verifiableCredential[i].proof.verificationMethod);
                let issuerRoot : string = issuerDID.GetUUID();
                let issuerDIDDoc : DIDDocument = await DIDDocument.readDIDDocument(provider, issuerRoot);
                let issuerKeyId : string = issuerDID.GetFragment();
                let nonce : string = presentationData.verifiableCredential[i].proof.nonce;
                let vc : VerifiableCredential = VerifiableCredential.DecodeFromJSON(<VerifiableCredentialDataModel>presentationData.verifiableCredential[i], { 'issuer' : issuerDIDDoc, 'issuerKeyId' : issuerKeyId, 'challengeNonce' : nonce});
                if(vc) {
                    verifiableCredentials.push(vc);
                } else {
                    reject("Invalid Verifiable Credential");
                }
            }
            resolve(new Presentation(verifiableCredentials, presentationSchema, context));
        });
    }

    private constructor(verifiableCredentials : VerifiableCredential[], presentationSchema ?: Schema, context : string = "iota.org") {
        super(context, presentationSchema);
        this.verifiableCredentials = verifiableCredentials;
    }

    public EncodeToJSON() : PresentationDataModel {
        let verifiableCredentialObjects : VerifiableCredentialDataModel[] = [];
        for(let i=0; i < this.verifiableCredentials.length; i++) {
            verifiableCredentialObjects.push(this.verifiableCredentials[i].EncodeToJSON());
        }

        let types : string[] = ["VerifiablePresentation"];
        if(this.schema) {
            types.push(this.schema.GetName());
        }

        let credentialData : PresentationDataModel =
        {
            "@context" : this.contexts,
            type : types,
            verifiableCredential : verifiableCredentialObjects
        };
        return credentialData;
    }
}