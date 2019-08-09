import * as MAM from '@iota/mam';
import { asciiToTrytes } from '@iota/converter';

/**
 * @module IOTA
 */

 /**
  * An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.
  */
export enum MAM_MODE {
    PRIVATE = 'private',
    PUBLIC = 'public',
    RESTRICTED = 'restricted'
}

/**
 * An interface for the state of the MAM Channel. Used for exporting the MAM state towards local storage.
 */
export interface MAMState {
    seed : string,
    mode : MAM_MODE,
    securityLevel : number,
    sideKey : string,
    nextRoot : string,
    channelStart : number
}

/**
 * An helper class to wrap writing data to the Tangle in a MAM Transaction.
 */
export class MAMPublisher {
    private securityLevel : number;
    private mode : MAM_MODE;
    private provider : string;
    private seed : string;

    private mamState : MAM.MamState;
    private sideKey : string;

    /**
     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {MAM_MODE} [mode] The mode of the channel. Defaults to Private mode.
     * @param {string} [sideKey] Encryption key for the restricted MAM mode. MUST supply a sideKey when on restricted mode. Otherwise ignored.
     * @param {number} [securityLevel] The security level for the MAM stream. 1-3 is allowed. Default to 2. 
     */
    constructor(provider : string, seed : string, mode : MAM_MODE = MAM_MODE.PRIVATE, sideKey ?: string, securityLevel : number = 2) {
        this.provider = provider;
        this.mode = mode;
        this.securityLevel = securityLevel;
        this.sideKey = (this.mode == MAM_MODE.RESTRICTED)?sideKey:undefined;
        this.seed = seed;
        this.mamState = MAM.init(this.provider, this.seed, this.securityLevel);
        this.mamState = MAM.changeMode(this.mamState, this.mode, this.sideKey);
    }

    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An Ascii encoded message to Publish. 
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
            "mode" : this.mode,
            "securityLevel" : this.securityLevel,
            "sideKey" : this.sideKey,
            "nextRoot" : this.mamState.channel.next_root,
            "channelStart" : this.mamState.channel.start
        }
    }
}

/**
 * Reads the MAM stream and outputs all the messages from root till the end.
 * @param {string} provider A URL to the node that will be used for Tangle interaction.
 * @param {string} root The root of the MAM channel that reading will start from.
 * @param {MAM_MODE} [mode] The mode of the channel. Defaults to Private mode.
 * @param {string} [sideKey] Encryption key for the restricted MAM mode. MUST supply a sideKey when on restricted mode. Otherwise ignored.
 * @param {number} [securityLevel] The security level for the MAM stream. 1-3 is allowed. Default to 2. 
 * @return {Promise<string[]>} Returns a Promise for an array of messages. Every item the array is the message from a MAM bundle. Returns Error on failure.
 */
export function ReadMAMStream(provider : string, root : string, mode : MAM_MODE = MAM_MODE.PRIVATE, sideKey ?: string, securityLevel : number = 2) : Promise<string[]> {
    return new Promise<string[]>((resolve, reject)=>{
        //TODO: Check if MAM.Init is needed.
        MAM.fetch(root, mode, sideKey)
        .then((result : any) => {
            resolve(result.messages);
        })
        .catch((err: Error) => { reject(err) });
    });
}