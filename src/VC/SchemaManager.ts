import * as fs from 'fs';
import { Schema } from './Schema';
import { DID } from '../DID/DID';

//TODO: Add DID's to trust
export class SchemaManager {
    private static instance : SchemaManager;
    private schemas : Schema[];

    private constructor() {
        this.schemas = [];

        //Load all default Schemas
        let folderPath : string = __dirname +"/Schemas";
        let filePaths : string[] = fs.readdirSync(folderPath);
        for(let i=0; i < filePaths.length; i++) {
            let fileName : string = filePaths[i].substr(0, filePaths[i].lastIndexOf('.'));
            this.AddSchemaFromFile(fileName, folderPath+"/"+filePaths[i]);
        }
    }

    public AddSchemaFromFile(name : string, path : string, trustedDIDs ?: DID[]) {
        let fileData : string = fs.readFileSync(path, "utf8");
        this.schemas.push( new Schema(name, JSON.parse(fileData), trustedDIDs) );
    }

    public AddSchema(name : string, layout : {}, trustedDIDs ?: DID[]) {
        this.schemas.push( new Schema(name, layout, trustedDIDs) );
    }

    public GetSchema(name : string) : Schema {
        for(let i=0; i < this.schemas.length; i++) {
            if (this.schemas[i].GetName() == name ) {
                return this.schemas[i];
            }
        }
        return undefined;
    }

    public GetSchemaNames() : string[] {
        let schemaNames : string[] = [];
        for(let i=0; i < this.schemas.length; i++) {
            schemaNames.push(this.schemas[i].GetName());
        }
        return schemaNames;
    }

    static GetInstance() : SchemaManager {
        if(!SchemaManager.instance) {
            SchemaManager.instance = new SchemaManager();
        }
        return SchemaManager.instance;
    }
}