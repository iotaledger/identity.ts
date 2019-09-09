"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Service = /** @class */ (function () {
    function Service(id, nameFragment, type, serviceEndpoint) {
        this.id = id;
        this.nameFragment = nameFragment;
        this.type = type;
        this.serviceEndpoint = serviceEndpoint;
    }
    Service.prototype.EncodeToJSON = function () {
        return {
            id: this.GetId(),
            type: this.type,
            serviceEndpoint: this.serviceEndpoint
        };
    };
    Service.prototype.GetName = function () {
        return this.nameFragment;
    };
    Service.prototype.GetId = function () {
        return this.id.GetDID() + "#" + this.nameFragment;
    };
    Service.prototype.GetType = function () {
        return this.type;
    };
    Service.prototype.GetServiceEndpoint = function () {
        return this.serviceEndpoint;
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=Service.js.map