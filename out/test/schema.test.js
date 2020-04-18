"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var SchemaManager_1 = require("../src/VC/SchemaManager");
var DID_1 = require("../src/DID/DID");
var RandomDID = new DID_1.DID("did:iota:main:ABCABCABC");
describe('Schemas', function () {
    var schema;
    var testObject;
    var SchemaList = ['DIDAuthenticationCredential', 'DomainValidatedCertificate', 'WhiteListedCredential', 'UserDataCredential'];
    it('Should contain a list of default schemas', function () {
        chai_1.expect(SchemaManager_1.SchemaManager.GetInstance().GetSchemaNames()).to.deep.equal(SchemaList);
    });
    it('Should be able to add an extra schema', function () {
        //Add timeout 
        this.timeout(4000);
        SchemaList.push("IOTATrainingCertificate");
        SchemaManager_1.SchemaManager.GetInstance().AddSchema("IOTATrainingCertificate", {
            type: "object",
            required: ["trainingTitle", "participant", "participationDate"],
            properties: {
                "trainingTitle": {
                    type: "string"
                },
                "participant": {
                    type: "string"
                },
                "participationDate": {
                    type: "string"
                }
            }
        });
        chai_1.expect(SchemaManager_1.SchemaManager.GetInstance().GetSchemaNames()).to.deep.equal(SchemaList);
    });
    it('Should validate correctly', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("IOTATrainingCertificate");
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg",
            "participationDate": new Date().toUTCString()
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should validate with extra fields', function () {
        var testObject2 = __assign(__assign({}, testObject), { "ExtraField": "Hello World" });
        chai_1.expect(schema.DoesObjectFollowSchema(testObject2)).to.be.true;
    });
    it('Should fail with a missing field', function () {
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg"
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.false;
    });
    it('Should fail with a wrong type', function () {
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg",
            "participationDate": 12
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.false;
    });
    it('Should correctly verify DIDAuthenticationCredential', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential");
        testObject = {
            "DID": "did:iota:main:123123"
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should correctly verify DomainValidatedCertificate', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate");
        testObject = {
            "id": "did:iota:main:123123",
            "domains": ["*.iota.org", "*.reddit.com"]
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should not trust a random DID', function () {
        chai_1.expect(schema.IsDIDTrusted(RandomDID)).to.be.false;
    });
    it('Should add and trust a DID', function () {
        schema.AddTrustedDID(RandomDID);
        chai_1.expect(schema.IsDIDTrusted(RandomDID)).to.be.true;
    });
});
//# sourceMappingURL=schema.test.js.map