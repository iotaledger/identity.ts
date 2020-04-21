"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Schema_1 = require("./Schema");
var DIDAuthenticationCredential = require('./Schemas/DIDAuthenticationCredential.json');
var DomainValidatedCertificate = require('./Schemas/DomainValidatedCertificate.json');
var WhiteListedCredential = require('./Schemas/WhiteListedCredential.json');
var UserDataCredential = require('./Schemas/UserDataCredential.json');
//TODO: Add DID's to trust
var SchemaManager = /** @class */ (function () {
    function SchemaManager() {
        this.schemas = [];
        //Load all default Schemas
        this.AddSchema('DIDAuthenticationCredential', DIDAuthenticationCredential);
        this.AddSchema('DomainValidatedCertificate', DomainValidatedCertificate);
        this.AddSchema('WhiteListedCredential', WhiteListedCredential);
        this.AddSchema('UserDataCredential', UserDataCredential);
    }
    SchemaManager.prototype.AddSchema = function (name, layout, trustedDIDs) {
        this.schemas.push(new Schema_1.Schema(name, layout, trustedDIDs));
    };
    SchemaManager.prototype.GetSchema = function (name) {
        for (var i = 0; i < this.schemas.length; i++) {
            if (this.schemas[i].GetName() === name) {
                return this.schemas[i];
            }
        }
        return undefined;
    };
    SchemaManager.prototype.GetSchemaNames = function () {
        var schemaNames = [];
        for (var i = 0; i < this.schemas.length; i++) {
            schemaNames.push(this.schemas[i].GetName());
        }
        return schemaNames;
    };
    SchemaManager.GetInstance = function () {
        if (!SchemaManager.instance) {
            SchemaManager.instance = new SchemaManager();
        }
        return SchemaManager.instance;
    };
    return SchemaManager;
}());
exports.SchemaManager = SchemaManager;
//# sourceMappingURL=SchemaManager.js.map