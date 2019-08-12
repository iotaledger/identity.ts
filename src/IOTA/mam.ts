import * as MAM from '@iota/mam';
import { asciiToTrytes, trytesToAscii } from '@iota/converter';


//Settings for a MAM stream. 
export class MAMSettings {
    public mode : MAM_MODE;
    public sideKey : string;
    public securityLevel : number;

    constructor(mode : MAM_MODE = MAM_MODE.PRIVATE, sideKey ?: string, securityLevel : number = 2) {
        this.mode = mode;
        this.sideKey = (this.mode == MAM_MODE.RESTRICTED)?sideKey:undefined;
        this.securityLevel = securityLevel;
    }
}


//An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.
export enum MAM_MODE {
    PRIVATE = 'private',
    PUBLIC = 'public',
    RESTRICTED = 'restricted'
}


//An interface for the state of the MAM Channel. Used for exporting the MAM state towards local storage.
export interface MAMState {
    seed : string,
    mode : MAM_MODE,
    securityLevel : number,
    sideKey : string,
    nextRoot : string,
    channelStart : number
}

//An helper class to wrap writing data to the Tangle in a MAM Transaction.
export class MAMPublisher {
    private settings : MAMSettings;
    private provider : string;
    private seed : string;
    private mamState : MAM.MamState;

    /**
     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
     */
    constructor(provider : string, seed : string, settings : MAMSettings = new MAMSettings()) {
        this.provider = provider;
        this.settings = settings;
        this.seed = seed;
        this.mamState = MAM.init(this.provider, this.seed, this.settings.securityLevel);
        this.mamState = MAM.changeMode(this.mamState, this.settings.mode, this.settings.sideKey);
    }

    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An ascii encoded message to Publish. 
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet. 
     * @return {Promise<string>} A promise for the root of the MAM transaction. On failure, returns an Error.
     */
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

    /**
     * Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.
     * @param {string} nextRoot The nextRoot of the Channel.
     * @param {number} channelStart The starting index of the channel.
     */
    public UpdateMAMState(nextRoot : string, channelStart : number) {
        this.mamState.channel.next_root = nextRoot;
        this.mamState.channel.start = channelStart;
    }

    /**
     * Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.
     * @return {MAMState} The state of the MAM channel. All you need to store for later synching.
     */
    public ExportState() : MAMState {
        return {
            "seed" : this.seed,
            "mode" : this.settings.mode,
            "securityLevel" : this.settings.securityLevel,
            "sideKey" : this.settings.sideKey,
            "nextRoot" : this.mamState.channel.next_root,
            "channelStart" : this.mamState.channel.start
        }
    }
}

/**
 * Reads the MAM stream and outputs all the messages from root till the end.
 * @param {string} provider A URL to the node that will be used for Tangle interaction.
 * @param {string} root The root of the MAM channel that reading will start from.
 * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
 * @return {Promise<string[]>} Returns a Promise for an array of messages in ascii encoding. Every item the array is the message from a MAM bundle. Returns Error on failure.
 */
export function ReadMAMStream(provider : string, root : string, settings : MAMSettings = new MAMSettings()) : Promise<string[]> {
    return new Promise<string[]>((resolve, reject)=>{
        //TODO: Check if MAM.Init is needed.
        MAM.fetch(root, settings.mode, settings.sideKey)
        .then((result : any) => {
            let messages : string[] = [];
            if(result.messages) {
                for(let i=0; i<result.messages.length; i++) {
                    messages.push(trytesToAscii(result.messages[i]));
                }
            }
            resolve(messages);
        })
        .catch((err: Error) => { reject(err) });
    });
}