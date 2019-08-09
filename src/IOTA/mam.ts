import * as MAM from '@iota/mam';
import { asciiToTrytes } from '@iota/converter';

export enum MAM_MODE {
    PRIVATE = 'private',
    PUBLIC = 'public',
    RESTRICTED = 'restricted'
}

export interface MAMState {
    seed : string,
    mode : MAM_MODE,
    securityLevel : number,
    sideKey : string,
    nextRoot : string,
    channelStart : number
}

export class MAMPublisher {
    private securityLevel : number;
    private mode : MAM_MODE;
    private provider : string;
    private seed : string;

    private mamState : MAM.MamState;
    private sideKey : string;

    constructor(provider : string, seed : string, mode : MAM_MODE = MAM_MODE.PRIVATE, sideKey ?: string, securityLevel : number = 2) {
        this.provider = provider;
        this.mode = mode;
        this.securityLevel = securityLevel;
        this.sideKey = sideKey;
        this.seed = seed;
        this.mamState = MAM.init(this.provider, this.seed, this.securityLevel);
        this.mamState = MAM.changeMode(this.mamState, this.mode, this.sideKey);
    }

    public PublishMessage(message : string, tag ?: string, mwm : number = 14) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let trytesMessage : string = asciiToTrytes(message);
            let mamMessage : MAM.MamMessage = MAM.create(this.mamState, trytesMessage);
            MAM.attach(mamMessage.payload, mamMessage.address, 3, mwm, tag)
            .then(()=> {
                this.mamState = mamMessage.state;
                resolve(mamMessage.root);
            })
            .catch((err : Error) => { reject(err) });
        });
        
    }

    public UpdateMAMState(nextRoot : string, channelStart : number) {
        this.mamState.channel.next_root = nextRoot;
        this.mamState.channel.start = channelStart;
    }

    public ExportState() : MAMState {
        return {
            "seed" : this.seed,
            "mode" : this.mode,
            "securityLevel" : this.securityLevel,
            "sideKey" : this.sideKey,
            "nextRoot" : this.mamState.channel.next_root,
            "channelStart" : this.mamState.channel.start
        }
    }
}

export function ReadMAMStream(provider : string, root : string, mode : MAM_MODE = MAM_MODE.PRIVATE, sideKey ?: string, securityLevel : number = 2) : Promise<string[]> {
    return new Promise<string[]>((resolve, reject)=>{
        MAM.fetch(root, mode, sideKey)
        .then((result : any) => {
            resolve(result.messages);
        })
        .catch((err: Error) => { reject(err) });
    });
}