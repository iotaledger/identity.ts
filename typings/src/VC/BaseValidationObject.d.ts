import { Schema } from "./Schema";
export declare abstract class BaseValidationObject {
    protected contexts: string[];
    protected schema: Schema;
    constructor(context: string, schema: Schema);
    abstract EncodeToJSON(): unknown;
    GetSchema(): Schema;
}
