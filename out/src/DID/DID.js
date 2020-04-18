"use strict";
/**
 * @module DID
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.
 * @class Decentralized Identifiers
 */
var DID = /** @class */ (function () {
    /**
     * Creates a DID object from a did string.
     * Accepted string formats:
     * - did:method:network:uuid
     * - did:method:uuid
     * - uuid
     * @param did The string containing the did, must fit the format.
     */
    function DID(did) {
        /** The network and optionally the shard of the network, where the DID Document is uploaded */
        this.network = "main";
        var parts = (did.match(/:/g) || []).length + 1;
        if (parts === 1) {
            this.uuid = did;
        }
        else if (parts === 3) {
            this.uuid = did.substr(did.lastIndexOf(":") + 1);
        }
        else if (parts === 4) {
            this.network = did.substr(0, did.lastIndexOf(":"));
            this.network = this.network.substr(this.network.lastIndexOf(":") + 1);
            this.uuid = did.substr(did.lastIndexOf(":") + 1);
        }
        //Load Fragment
        var fragmentIndex = this.uuid.lastIndexOf("#");
        if (fragmentIndex >= 0) {
            this.fragment = this.uuid.substr(fragmentIndex + 1);
            this.uuid = this.uuid.substr(0, fragmentIndex);
        }
    }
    /**
     * Returns the DID that correctly references the DID document. Should be used for any DID standard output.
     * @returns {string} DID
     */
    DID.prototype.GetDID = function () {
        return DID.urlScheme + ":" + DID.didMethod + ":" + this.uuid;
    };
    /**
     * Returns the DID, extended with the network/shard of the network it is found at.
     * @returns {string} DID + network/shard
     */
    DID.prototype.GetSpecificDID = function () {
        return DID.urlScheme + ":" + DID.didMethod + ":" + this.network + ":" + this.uuid;
    };
    /**
     * Returns the Universal Unique IDentifier, the last part of the DID.
     * @returns {string} UUID
     */
    DID.prototype.GetUUID = function () {
        return this.uuid;
    };
    /**
     * Returns the fragment, if present, from the DID. Otherwise returns undefined.
     * @returns {string|undefined} fragment
     */
    DID.prototype.GetFragment = function () {
        return this.fragment;
    };
    /** The standard convention of starting a DID with "did:" */
    DID.urlScheme = "did";
    /** The DID method that it implements. Hardcoded IOTA */
    DID.didMethod = "IOTA";
    return DID;
}());
exports.DID = DID;
//# sourceMappingURL=DID.js.map