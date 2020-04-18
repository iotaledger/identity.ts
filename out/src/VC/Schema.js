"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tv4 = require("tv4");
var Schema = /** @class */ (function () {
    function Schema(name, layout, trustedDIDs) {
        if (trustedDIDs === void 0) { trustedDIDs = []; }
        this.name = name;
        this.layout = layout;
        this.trustedDIDs = trustedDIDs;
    }
    Schema.prototype.AddTrustedDID = function (trustedDID) {
        this.trustedDIDs.push(trustedDID);
    };
    Schema.prototype.RemoveTrustedDID = function (did) {
        var index = this.trustedDIDs.indexOf(did);
        if (index > -1) {
            this.trustedDIDs.splice(index, 1);
        }
    };
    Schema.prototype.DoesObjectFollowSchema = function (object) {
        var result = tv4.validate(object, this.layout);
        if (!result) {
            console.log(JSON.stringify({ message: tv4.error.message, params: tv4.error.params, dataPath: tv4.error.dataPath, schemaPath: tv4.error.schemaPath }));
        }
        return result;
    };
    Schema.prototype.IsDIDTrusted = function (did) {
        for (var i = 0; i < this.trustedDIDs.length; i++) {
            if (this.trustedDIDs[i].GetDID() === did.GetDID()) {
                return true;
            }
        }
        return false;
    };
    Schema.prototype.GetName = function () {
        return this.name;
    };
    return Schema;
}());
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map