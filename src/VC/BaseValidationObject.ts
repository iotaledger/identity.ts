import { Schema } from "./Schema";

export abstract class BaseValidationObject {
    protected contexts : string[];
    protected schema : Schema;

    constructor(context : string, schema : Schema) {
        this.contexts = ["https://www.w3.org/2018/credentials/v1", context];
        this.schema = schema;
    }

    public abstract EncodeToJSON() : unknown;

    public GetSchema() : Schema {
        return this.schema;
    }
}