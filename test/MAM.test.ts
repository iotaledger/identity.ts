import { expect } from 'chai';
import 'mocha';
import { delay, provider } from './test.settings';
import { MAMPublisher, MAMState, MAM_MODE, ReadMAMStream, MAMSettings } from "./../src/IOTA/mam";
import { GenerateSeed } from "./../src/Helpers/GenerateSeed";

describe('Masked Autenticated Messaging', function() {
    let firstPublisher : MAMPublisher;
    let secondPublisher : MAMPublisher;
    let rootOfFirstMessage : string;
    let state : MAMState;

    it('Should send a valid first transaction', async function(){
        this.timeout(20000);
        firstPublisher = new MAMPublisher(provider, GenerateSeed());
        rootOfFirstMessage = await firstPublisher.PublishMessage("First Message", undefined, 9);
        expect(rootOfFirstMessage).to.not.be.undefined;
    });

    it('Should read the first message', async function() {
        this.timeout(20000);
        await delay(2000); //Sleep prevents the node to not know about the first tx yet, failing the test.
        let messages : string[] = await ReadMAMStream(provider, rootOfFirstMessage);
        expect(messages[0]).to.deep.equal("First Message");
    });

    it('Should send a valid second transaction', async function(){
        this.timeout(20000);
        let root2 = await firstPublisher.PublishMessage("Second Message", undefined, 9);
        expect(root2).to.not.be.undefined;
    });

    it('Should read the first 2 messages', async function() {
        let messages : string[] = await ReadMAMStream(provider, rootOfFirstMessage);
        expect(messages[0]).to.deep.equal("First Message");
        expect(messages[1]).to.deep.equal("Second Message");
    });

    it('Should export the correct state', function() {
        state = firstPublisher.ExportState();
        expect(state.channelStart).to.deep.equal(2);
        expect(state.mode).to.deep.equal(MAM_MODE.PRIVATE);
        expect(state.nextRoot).to.not.be.undefined;
        expect(state.securityLevel).to.deep.equal(2);
        expect(state.seed).to.not.be.undefined;
        expect(state.sideKey).to.be.undefined;
    });

    it('Should send a valid third transaction (After state import)', async function() {
        secondPublisher = new MAMPublisher(provider, state.seed, new MAMSettings(state.mode, state.sideKey, state.securityLevel));
        secondPublisher.UpdateMAMState(state.nextRoot, state.channelStart);
        let root3 = await secondPublisher.PublishMessage("Third Message", undefined, 9);
        expect(root3).to.not.be.undefined;
    });

    it('Should read the first 3 messages', async function() {
        let messages : string[] = await ReadMAMStream(provider, rootOfFirstMessage);
        expect(messages[0]).to.deep.equal("First Message");
        expect(messages[1]).to.deep.equal("Second Message");
        expect(messages[2]).to.deep.equal("Third Message");
    });
});