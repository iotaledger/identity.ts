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
var chai_1 = require("chai");
require("mocha");
var mam_1 = require("./../src/IOTA/mam");
var GenerateSeed_1 = require("./../src/Helpers/GenerateSeed");
var provider = "https://nodes.devnet.iota.org:443";
describe('Masked Autenticated Messaging', function () {
    var firstPublisher;
    var secondPublisher;
    var rootOfFirstMessage;
    var state;
    it('Should send a valid first transaction', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        firstPublisher = new mam_1.MAMPublisher(provider, GenerateSeed_1.GenerateSeed());
                        return [4 /*yield*/, firstPublisher.PublishMessage("First Message", undefined, 9)];
                    case 1:
                        rootOfFirstMessage = _a.sent();
                        chai_1.expect(rootOfFirstMessage).to.not.be.undefined;
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should read the first message', function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, delay(2000)];
                    case 1:
                        _a.sent(); //Sleep prevents the node to not know about the first tx yet, failing the test.
                        return [4 /*yield*/, mam_1.ReadMAMStream(provider, rootOfFirstMessage)];
                    case 2:
                        messages = _a.sent();
                        chai_1.expect(messages[0]).to.deep.equal("First Message");
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should send a valid second transaction', function () {
        return __awaiter(this, void 0, void 0, function () {
            var root2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timeout(20000);
                        return [4 /*yield*/, firstPublisher.PublishMessage("Second Message", undefined, 9)];
                    case 1:
                        root2 = _a.sent();
                        chai_1.expect(root2).to.not.be.undefined;
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should read the first 2 messages', function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mam_1.ReadMAMStream(provider, rootOfFirstMessage)];
                    case 1:
                        messages = _a.sent();
                        chai_1.expect(messages[0]).to.deep.equal("First Message");
                        chai_1.expect(messages[1]).to.deep.equal("Second Message");
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should export the correct state', function () {
        state = firstPublisher.ExportState();
        chai_1.expect(state.channelStart).to.deep.equal(2);
        chai_1.expect(state.mode).to.deep.equal(mam_1.MAM_MODE.PRIVATE);
        chai_1.expect(state.nextRoot).to.not.be.undefined;
        chai_1.expect(state.securityLevel).to.deep.equal(2);
        chai_1.expect(state.seed).to.not.be.undefined;
        chai_1.expect(state.sideKey).to.be.undefined;
    });
    it('Should send a valid third transaction (After state import)', function () {
        return __awaiter(this, void 0, void 0, function () {
            var root3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        secondPublisher = new mam_1.MAMPublisher(provider, state.seed, new mam_1.MAMSettings(state.mode, state.sideKey, state.securityLevel));
                        secondPublisher.UpdateMAMState(state.nextRoot, state.channelStart);
                        return [4 /*yield*/, secondPublisher.PublishMessage("Third Message", undefined, 9)];
                    case 1:
                        root3 = _a.sent();
                        chai_1.expect(root3).to.not.be.undefined;
                        return [2 /*return*/];
                }
            });
        });
    });
    it('Should read the first 3 messages', function () {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mam_1.ReadMAMStream(provider, rootOfFirstMessage)];
                    case 1:
                        messages = _a.sent();
                        chai_1.expect(messages[0]).to.deep.equal("First Message");
                        chai_1.expect(messages[1]).to.deep.equal("Second Message");
                        chai_1.expect(messages[2]).to.deep.equal("Third Message");
                        return [2 /*return*/];
                }
            });
        });
    });
});
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=MAM.test.js.map