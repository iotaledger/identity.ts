import { DID } from "../DID/DID";
import { validate } from 'tv4';

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
        return validate(object, this.layout);
    }

    public IsDIDTrusted( did : DID ) : boolean {
        return (this.trustedDIDs.indexOf(did) > -1);
    }

    public GetName() : string {
        return this.name;
    }
}