/**
 * @module DID
 */

 /**
  * This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.
  * @class Decentralized Identifiers
  */
export class DID {
    /** The standard convention of starting a DID with "did:" */
    private static readonly urlScheme : string = "did";
    /** The DID method that it implements. Hardcoded IOTA */
    private static readonly didMethod : string = "IOTA";
    /** The network and optionally the shard of the network, where the DID Document is uploaded */
    private network : string = "main";
    /** The Universal Unique IDentifier, which allows an identity to be uniquely identified. */
    private uuid : string;

    constructor(uuid : string) {
        this.uuid = uuid;
    }

    /**
     * Returns the DID that correctly references the DID document. Should be used for any DID standard output.
     * @returns {string} DID
     */
    public GetDID() : string {
        return DID.urlScheme + ":" + DID.didMethod + ":" + this.uuid;
    }

    /**
     * Returns the DID, extended with the network/shard of the network it is found at.
     * @returns {string} DID + network/shard
     */
    public GetSpecificDID() : string {
        return DID.urlScheme + ":" + DID.didMethod + ":" + this.network + ":" + this.uuid;
    }

    /**
     * Returns the Universal Unique IDentifier, the last part of the DID.
     * @returns {string} UUID
     */
    public GetUUID() : string {
        return this.uuid;
    }

}