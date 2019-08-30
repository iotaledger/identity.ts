/**
 * @module DID
 */
/**
 * This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.
 * @class Decentralized Identifiers
 */
export declare class DID {
    /** The standard convention of starting a DID with "did:" */
    private static readonly urlScheme;
    /** The DID method that it implements. Hardcoded IOTA */
    private static readonly didMethod;
    /** The network and optionally the shard of the network, where the DID Document is uploaded */
    private network;
    /** The Universal Unique IDentifier, which allows an identity to be uniquely identified. */
    private uuid;
    /** DID Fragment references to a component of the DID Document */
    private fragment;
    /**
     * Creates a DID object from a did string.
     * Accepted string formats:
     * - did:method:network:uuid
     * - did:method:uuid
     * - uuid
     * @param did The string containing the did, must fit the format.
     */
    constructor(did: string);
    /**
     * Returns the DID that correctly references the DID document. Should be used for any DID standard output.
     * @returns {string} DID
     */
    GetDID(): string;
    /**
     * Returns the DID, extended with the network/shard of the network it is found at.
     * @returns {string} DID + network/shard
     */
    GetSpecificDID(): string;
    /**
     * Returns the Universal Unique IDentifier, the last part of the DID.
     * @returns {string} UUID
     */
    GetUUID(): string;
    /**
     * Returns the fragment, if present, from the DID. Otherwise returns undefined.
     * @returns {string|undefined} fragment
     */
    GetFragment(): string | undefined;
}
