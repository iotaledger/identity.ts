/**
 * @module DID
 */

 /**
  * @class
  * @classdesc This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.
  */
export class DID {
    private urlScheme : string = "did";
    private didMethod : string = "IOTA";
    private network : string = "main";
    private uuid : string;

    constructor(uuid : string) {
        this.uuid = uuid;
    }

    public GetDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.uuid;
    }

    public GetSpecificDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.network + ":" + this.uuid;
    }

    public GetUUID() : string {
        return this.uuid;
    }

}