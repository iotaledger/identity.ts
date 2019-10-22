"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var DID_1 = require("./DID");
var DIDKeypair_1 = require("./DIDKeypair");
var mam_1 = require("./../IOTA/mam");
var RSAKeypair_1 = require("../Encryption/RSAKeypair");
var Service_1 = require("./Service");
/**
 * @module DID
 */
/**
 * Handles the DID Document standard. Allows CRUD operations on DID Documents and publishing it too the Tangle.
 * Any CRUD operations that are not published will be lost once the program exits.
 */
var DIDDocument = /** @class */ (function () {
    function DIDDocument(contexts, DID) {
        this.contexts = contexts;
        this.DID = DID;
        this.publicKeys = [];
        this.services = [];
    }
    DIDDocument.readDIDDocument = function (provider, root, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        //Retrieve the DID Document
                        mam_1.ReadMAMStream(provider, root, settings)
                            .then(function (messages) {
                            var latestDIDDocument = messages[messages.length - 1];
                            var JSONDocument = JSON.parse(latestDIDDocument);
                            //Verify if it contains a valid JSON
                            try {
                                JSONDocument = JSON.parse(latestDIDDocument);
                            }
                            catch (err) {
                                reject("JSON Parse Error: " + err);
                            }
                            ;
                            //Parse the DID Document
                            var document = new DIDDocument(JSONDocument["@context"], new DID_1.DID(JSONDocument.id));
                            //Public keys
                            var publicKeys = JSONDocument["publicKey"];
                            if (publicKeys) {
                                for (var i = 0; i < publicKeys.length; i++) {
                                    var keypair = void 0;
                                    if (publicKeys[i].type == "RsaVerificationKey2018") {
                                        keypair = new RSAKeypair_1.RSAKeypair(publicKeys[i].publicKeyPem);
                                    }
                                    document.AddKeypair(keypair, publicKeys[i].id.substr(publicKeys[i].id.lastIndexOf("#") + 1), new DID_1.DID(publicKeys[i].id.substr(0, publicKeys[i].id.lastIndexOf("#"))), new DID_1.DID(publicKeys[i].controller));
                                }
                            }
                            //Service Endpoints
                            var services = JSONDocument["service"];
                            if (services) {
                                for (var i = 0; i < services.length; i++) {
                                    var service = services[i];
                                    var did = new DID_1.DID(service.id);
                                    document.AddServiceEndpoint(new Service_1.Service(did, did.GetFragment(), service.type, service.serviceEndpoint));
                                }
                            }
                            resolve(document);
                        })
                            .catch(function (err) { return reject(err); });
                    })];
            });
        });
    };
    /**
     * Creates a new DID Document from scratch. This is only for new Identities.
     * @param {DID} did The DID that will point towards this document.
     * @return {DIDDocument} A newly created class instance of DIDDocument.
     */
    DIDDocument.createDIDDocument = function (did) {
        return new DIDDocument(["https://www.w3.org/2019/did/v1"], did);
    };
    /**
     * Adds a keypair to the DID Document.
     * @param {BaseKeypair} keypair The keypair instance that will now be added to the DID Document.
     * @param {string} keyId The name of the publicKey. Must be unique in the document.
     * @param {DID} [keyOwner] The DID of the owner of the publicKey. Defaults to the DID of the DID Document.
     * @param {DID} [keyController] The DID of the controller of the publicKey. Defaults to the keyOwner.
     */
    DIDDocument.prototype.AddKeypair = function (keypair, keyId, keyOwner, keyController) {
        this.publicKeys.push(new DIDKeypair_1.DIDKeypair(keypair, keyId, (keyOwner) ? keyOwner : this.DID, keyController));
    };
    /**
     * Creates a new ServiceEndpoint, which can be used to add any type of service to the DID.
     * @param {Service} service The service to add to the DID Document.
     */
    DIDDocument.prototype.AddServiceEndpoint = function (service) {
        this.services.push(service);
    };
    /**
     * Creates the DID Document, which is compatible with the DID standard from W3C.
     * @return {string} The stringified version of the JSON-LD formatted DID Document.
     */
    DIDDocument.prototype.GetJSONDIDDocument = function () {
        var JSONObject = {
            "@context": this.contexts,
            id: this.DID.GetDID()
        };
        if (this.publicKeys.length) {
            JSONObject["publicKey"] = [];
            for (var i = 0; i < this.publicKeys.length; i++) {
                JSONObject["publicKey"].push(this.publicKeys[i].GetJSON());
            }
        }
        if (this.authentications) {
            JSONObject["authentication"] = this.authentications; //TODO: create return function
        }
        if (this.services.length) {
            JSONObject["service"] = [];
            for (var i = 0; i < this.services.length; i++) {
                JSONObject["service"].push(this.services[i].EncodeToJSON());
            }
        }
        return JSON.stringify(JSONObject, null, 2); //TODO: Remove Pretty print
    };
    /**
     * @return {DID} Returns the DID associated with this DID Documents.
     */
    DIDDocument.prototype.GetDID = function () {
        return this.DID;
    };
    DIDDocument.prototype.GetKeypair = function (keyId) {
        for (var i = 0; i < this.publicKeys.length; i++) {
            if (this.publicKeys[i].GetKeyId() == keyId) {
                return this.publicKeys[i];
            }
        }
        return null;
    };
    DIDDocument.prototype.GetService = function (name) {
        for (var i = 0; i < this.services.length; i++) {
            if (this.services[i].GetName() == name || this.services[i].GetType() == name) {
                return this.services[i];
            }
        }
        return null;
    };
    return DIDDocument;
}());
exports.DIDDocument = DIDDocument;
//# sourceMappingURL=DIDDocument.js.map