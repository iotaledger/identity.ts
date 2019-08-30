"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DID_1 = require("../DID/DID");
var RecursiveSort_1 = require("../Helpers/RecursiveSort");
var SchemaManager_1 = require("./SchemaManager");
var BaseValidationObject_1 = require("./BaseValidationObject");
var Credential = /** @class */ (function (_super) {
    __extends(Credential, _super);
    function Credential(context, credentialSchema, issuerDID, credentialData, issuanceData) {
        if (issuanceData === void 0) { issuanceData = new Date(); }
        var _this = _super.call(this, context, credentialSchema) || this;
        _this.issuerDID = issuerDID;
        _this.issuanceData = issuanceData.toUTCString();
        _this.credentialSubjects = RecursiveSort_1.RecursiveSort(credentialData);
        return _this;
    }
    Credential.Create = function (credentialSchema, issuerDID, credentialData, issuanceData, context) {
        if (issuanceData === void 0) { issuanceData = new Date(); }
        if (context === void 0) { context = "iota.org"; }
        return new Credential(context, credentialSchema, issuerDID, credentialData, issuanceData);
    };
    Credential.DecodeFromJSON = function (credentialData) {
        return new Credential(credentialData["@context"][1], SchemaManager_1.SchemaManager.GetInstance().GetSchema(credentialData.type[1]), new DID_1.DID(credentialData.issuer), credentialData.credentialSubject, new Date(credentialData.issuanceDate));
    };
    Credential.prototype.GetCredential = function () {
        return this.credentialSubjects;
    };
    Credential.prototype.EncodeToJSON = function () {
        var credentialData = {
            "@context": this.contexts,
            type: ["VerifiableCredential", this.schema.GetName()],
            issuer: this.issuerDID.GetDID(),
            issuanceDate: this.issuanceData,
            credentialSubject: this.credentialSubjects
        };
        return credentialData;
    };
    ;
    return Credential;
}(BaseValidationObject_1.BaseValidationObject));
exports.Credential = Credential;
//# sourceMappingURL=Credential.js.map