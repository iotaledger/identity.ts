"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Schema_1 = require("./Schema");
//TODO: Add DID's to trust
var SchemaManager = /** @class */ (function () {
    function SchemaManager() {
        this.schemas = [];
        //Load all default Schemas
        var folderPath = __dirname + "/Schemas";
        var filePaths = fs.readdirSync(folderPath);
        for (var i = 0; i < filePaths.length; i++) {
            var fileName = filePaths[i].substr(0, filePaths[i].lastIndexOf('.'));
            this.AddSchemaFromFile(fileName, folderPath + "/" + filePaths[i]);
        }
    }
    SchemaManager.prototype.AddSchemaFromFile = function (name, path, trustedDIDs) {
        var fileData = fs.readFileSync(path, "utf8");
        this.schemas.push(new Schema_1.Schema(name, JSON.parse(fileData), trustedDIDs));
    };
    SchemaManager.prototype.AddSchema = function (name, layout, trustedDIDs) {
        this.schemas.push(new Schema_1.Schema(name, layout, trustedDIDs));
    };
    SchemaManager.prototype.GetSchema = function (name) {
        for (var i = 0; i < this.schemas.length; i++) {
            if (this.schemas[i].GetName() == name) {
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