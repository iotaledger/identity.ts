import { DID } from './DID';

export interface ServiceDataModel {
    id : string,
    type : string,
    serviceEndpoint : string
}

export class Service {
    private id : DID;
    private nameFragment : string;
    private type : string;
    private serviceEndpoint : string;

    constructor(id : DID, nameFragment : string, type : string, serviceEndpoint : string) {
        this.id = id;
        this.nameFragment = nameFragment;
        this.type = type;
        this.serviceEndpoint = serviceEndpoint;
    }

    public EncodeToJSON() : ServiceDataModel {
        return {
            id : this.GetId(),
            type : this.type,
            serviceEndpoint : this.serviceEndpoint
        }
    }

    public GetName() : string {
        return this.nameFragment;
    }

    public GetId() : string {
        return this.id.GetDID() + "#" + this.nameFragment;
    }

    public GetType() : string {
        return this.type;
    }

    public GetServiceEndpoint() : string {
        return this.serviceEndpoint;
    }
}