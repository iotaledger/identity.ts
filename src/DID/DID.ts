/**
 * @module DID
 */

 /**
  * This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.
  */
export class DID {
    private urlScheme : string = "did";
    private didMethod : string = "IOTA";
    private network : string = "main";
    private uuid : string;

    constructor(uuid : string) {
        this.uuid = uuid;
    }

    /**
     * @returns {string} Returns the DID that correctly references the DID document. Should be used for any DID standard output.
     */
    public GetDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.uuid;
    }

    /**
     * @returns {string} Returns the DID, extended with the network/shard of the network it is found at.
     */
    public GetSpecificDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.network + ":" + this.uuid;
    }

    /**
     * @returns {string} Returns the Universal Unique IDentifier, the last part of the DID.
     */
    public GetUUID() : string {
        return this.uuid;
    }

}