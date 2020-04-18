import { Schema } from './Schema';
import { DID } from '../DID/DID';
const DIDAuthenticationCredential = require('./Schemas/DIDAuthenticationCredential.json');
const DomainValidatedCertificate = require('./Schemas/DomainValidatedCertificate.json');
const WhiteListedCredential = require('./Schemas/WhiteListedCredential.json');
const UserDataCredential = require('./Schemas/UserDataCredential.json');

//TODO: Add DID's to trust
export class SchemaManager {
    private static instance : SchemaManager;
    private schemas : Schema[];

    private constructor() {
        this.schemas = [];

        //Load all default Schemas
        this.AddSchema('DIDAuthenticationCredential', DIDAuthenticationCredential);
        this.AddSchema('DomainValidatedCertificate', DomainValidatedCertificate);
        this.AddSchema('WhiteListedCredential', WhiteListedCredential);
        this.AddSchema('UserDataCredential', UserDataCredential);
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
