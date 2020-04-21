import { DID } from "../DID/DID";
import * as tv4 from 'tv4';

export class Schema {
    private name : string;
    private layout : tv4.JsonSchema;
    private trustedDIDs : DID[];

    constructor(name : string, layout : {}, trustedDIDs : DID[] = []) {
        this.name = name;
        this.layout = layout;
        this.trustedDIDs = trustedDIDs;
    }

    public AddTrustedDID(trustedDID : DID) {
        this.trustedDIDs.push(trustedDID);
    }

    public RemoveTrustedDID(did : DID) {
        let index : number = this.trustedDIDs.indexOf(did);
        if(index > -1) {
            this.trustedDIDs.splice(index, 1);
        }
    }

    public DoesObjectFollowSchema( object : {} ) : boolean {
        let result : boolean = tv4.validate(object, this.layout);
        if(!result) {
            console.log(JSON.stringify({message : tv4.error.message, params : tv4.error.params, dataPath : tv4.error.dataPath, schemaPath: tv4.error.schemaPath}));
        }
        return result;
    }

    public IsDIDTrusted( did : DID ) : boolean {
        for(let i=0; i < this.trustedDIDs.length; i++) {
            if(this.trustedDIDs[i].GetDID() === did.GetDID()) {
                return true;
            }
        }
        return false;
    }

    public GetName() : string {
        return this.name;
    }
}