export class DID {
    private urlScheme : string = "did";
    private didMethod : string = "iota";
    private network : string = "main";
    private uuid : string;

    constructor(uuid : string) {
        this.uuid = uuid;
    }

    public GetDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.uuid;
    }

    public GetSpecificDID() : string {
        return this.urlScheme + ":" + this.didMethod + ":" + this.network + ":" + this.uuid;
    }

    public GetUUID() : string {
        return this.uuid;
    }

}