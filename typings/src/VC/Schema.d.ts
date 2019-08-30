import { DID } from "../DID/DID";
export declare class Schema {
    private name;
    private layout;
    private trustedDIDs;
    constructor(name: string, layout: {}, trustedDIDs?: DID[]);
    AddTrustedDID(trustedDID: DID): void;
    RemoveTrustedDID(did: DID): void;
    DoesObjectFollowSchema(object: {}): boolean;
    IsDIDTrusted(did: DID): boolean;
    GetName(): string;
}
