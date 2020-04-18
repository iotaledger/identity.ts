import { Schema } from './Schema';
import { DID } from '../DID/DID';
export declare class SchemaManager {
    private static instance;
    private schemas;
    private constructor();
    AddSchema(name: string, layout: {}, trustedDIDs?: DID[]): void;
    GetSchema(name: string): Schema;
    GetSchemaNames(): string[];
    static GetInstance(): SchemaManager;
}
