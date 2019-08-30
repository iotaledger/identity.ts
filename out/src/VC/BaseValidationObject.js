"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseValidationObject = /** @class */ (function () {
    function BaseValidationObject(context, schema) {
        this.contexts = ["https://www.w3.org/2018/credentials/v1", context];
        this.schema = schema;
    }
    BaseValidationObject.prototype.GetSchema = function () {
        return this.schema;
    };
    return BaseValidationObject;
}());
exports.BaseValidationObject = BaseValidationObject;
//# sourceMappingURL=BaseValidationObject.js.map