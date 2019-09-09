import { DID } from './DID';
export interface ServiceDataModel {
    id: string;
    type: string;
    serviceEndpoint: string;
}
export declare class Service {
    private id;
    private nameFragment;
    private type;
    private serviceEndpoint;
    constructor(id: DID, nameFragment: string, type: string, serviceEndpoint: string);
    EncodeToJSON(): ServiceDataModel;
    GetName(): string;
    GetId(): string;
    GetType(): string;
    GetServiceEndpoint(): string;
}
