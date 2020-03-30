import {
    IMamChannelState
} from '@iota/mam.js';
import { MAMPublisher, MAMSettings } from './mam';
import { DIDDocument } from './../DID/DIDDocument';

/**
 * @module IOTA
 */

/**
 * A Publisher for DID Documents. Internally tracks MAM state so multiple publish calls can be handeld without having to track the state. 
 */
export class DIDPublisher {
    private publisher: MAMPublisher;

    /**

     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {{nextRoot:string, channelState:number}} [channelState] The state of the MAM channel. Used when continueing an existing MAM channel, with locally stored progress.
     * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
     */
    constructor(provider: string, seed: string, channelState?: IMamChannelState, settings?: MAMSettings) {
        this.publisher = new MAMPublisher(provider, seed, settings);

        if (channelState) {
            this.publisher.ChannelState = channelState;
        }
    }

    /**
     * Publishes a DID Document to the MAM channel in JSON format. WARNING: Do not upload people's DID Documents as these fall under GDPR & other privacy laws protection! 
     * @param {DIDDocument} document The DID Document to upload to the MAM stream.
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet. 
     * @return {Promise<string>} The root of the latest transaction of the MAM stream transaction.
     */
    public PublishDIDDocument(document: DIDDocument, tag?: string, mwm: number = 14): Promise<string> {
        return this.publisher.PublishMessage(document.GetJSONDIDDocument(), tag, mwm);
    }

    /**
     * Exports the full state of the MAM channel. Used for local storage of the State, which allows for reusing the MAM channel at a later time. 
     * @return {IMamChannelState} An object containing every variable needed to reinitialize the MAM channel at a later time. 
     */
    public ExportMAMChannelState(): IMamChannelState {
        return this.publisher.ExportState();
    }
}