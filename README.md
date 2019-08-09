# Identity.ts 

## Prerequisits

Node v10+

## API Reference

    
* [DID](#module_DID)
    * [~DID](#module_DID..DID)
        * [new DID()](#new_module_DID..DID_new)
        * [.GetDID()](#module_DID..DID+GetDID) ⇒ <code>string</code>
        * [.GetSpecificDID()](#module_DID..DID+GetSpecificDID) ⇒ <code>string</code>
        * [.GetUUID()](#module_DID..DID+GetUUID) ⇒ <code>string</code>
    * [~DIDDocument](#module_DID..DIDDocument)
        * _instance_
            * [.AddKeypair(keypair, keyId, [keyOwner], [keyController])](#module_DID..DIDDocument+AddKeypair)
            * [.GetJSONDIDDocument()](#module_DID..DIDDocument+GetJSONDIDDocument) ⇒ <code>string</code>
            * [.GetDID()](#module_DID..DIDDocument+GetDID) ⇒ <code>DID</code>
        * _static_
            * [.createDIDDocument(did)](#module_DID..DIDDocument.createDIDDocument) ⇒ <code>DIDDocument</code>

<a name="module_DID..DID"></a>

### DID~DID
<p>Decentralized Identifiers</p>

**Kind**: inner class of [<code>DID</code>](#module_DID)  

* [~DID](#module_DID..DID)
    * [new DID()](#new_module_DID..DID_new)
    * [.GetDID()](#module_DID..DID+GetDID) ⇒ <code>string</code>
    * [.GetSpecificDID()](#module_DID..DID+GetSpecificDID) ⇒ <code>string</code>
    * [.GetUUID()](#module_DID..DID+GetUUID) ⇒ <code>string</code>

<a name="new_module_DID..DID_new"></a>

#### new DID()
<p>The Universal Unique IDentifier, which allows an identity to be uniquely identified.</p>

<a name="module_DID..DID+GetDID"></a>

#### diD.GetDID() ⇒ <code>string</code>
<p>Returns the DID that correctly references the DID document. Should be used for any DID standard output.</p>

**Kind**: instance method of [<code>DID</code>](#module_DID..DID)  
**Returns**: <code>string</code> - <p>DID</p>  
<a name="module_DID..DID+GetSpecificDID"></a>

#### diD.GetSpecificDID() ⇒ <code>string</code>
<p>Returns the DID, extended with the network/shard of the network it is found at.</p>

**Kind**: instance method of [<code>DID</code>](#module_DID..DID)  
**Returns**: <code>string</code> - <p>DID + network/shard</p>  
<a name="module_DID..DID+GetUUID"></a>

#### diD.GetUUID() ⇒ <code>string</code>
<p>Returns the Universal Unique IDentifier, the last part of the DID.</p>

**Kind**: instance method of [<code>DID</code>](#module_DID..DID)  
**Returns**: <code>string</code> - <p>UUID</p>  
<a name="module_DID..DIDDocument"></a>

### DID~DIDDocument
<p>Handles the DID Document standard. Allows CRUD operations on DID Documents and publishing it too the Tangle.
Any CRUD operations that are not published will be lost once the program exits.</p>

**Kind**: inner class of [<code>DID</code>](#module_DID)  

* [~DIDDocument](#module_DID..DIDDocument)
    * _instance_
        * [.AddKeypair(keypair, keyId, [keyOwner], [keyController])](#module_DID..DIDDocument+AddKeypair)
        * [.GetJSONDIDDocument()](#module_DID..DIDDocument+GetJSONDIDDocument) ⇒ <code>string</code>
        * [.GetDID()](#module_DID..DIDDocument+GetDID) ⇒ <code>DID</code>
    * _static_
        * [.createDIDDocument(did)](#module_DID..DIDDocument.createDIDDocument) ⇒ <code>DIDDocument</code>

<a name="module_DID..DIDDocument+AddKeypair"></a>

#### didDocument.AddKeypair(keypair, keyId, [keyOwner], [keyController])
<p>Adds a keypair to the DID Document.</p>

**Kind**: instance method of [<code>DIDDocument</code>](#module_DID..DIDDocument)  

| Param | Type | Description |
| --- | --- | --- |
| keypair | <code>BaseKeypair</code> | <p>The keypair instance that will now be added to the DID Document.</p> |
| keyId | <code>string</code> | <p>The name of the publicKey. Must be unique in the document.</p> |
| [keyOwner] | <code>DID</code> | <p>The DID of the owner of the publicKey. Defaults to the DID of the DID Document.</p> |
| [keyController] | <code>DID</code> | <p>The DID of the controller of the publicKey. Defaults to the keyOwner.</p> |

<a name="module_DID..DIDDocument+GetJSONDIDDocument"></a>

#### didDocument.GetJSONDIDDocument() ⇒ <code>string</code>
<p>Creates the DID Document, which is compatible with the DID standard from W3C.</p>

**Kind**: instance method of [<code>DIDDocument</code>](#module_DID..DIDDocument)  
**Returns**: <code>string</code> - <p>The stringified version of the JSON-LD formatted DID Document.</p>  
<a name="module_DID..DIDDocument+GetDID"></a>

#### didDocument.GetDID() ⇒ <code>DID</code>
**Kind**: instance method of [<code>DIDDocument</code>](#module_DID..DIDDocument)  
**Returns**: <code>DID</code> - <p>Returns the DID associated with this DID Documents.</p>  
<a name="module_DID..DIDDocument.createDIDDocument"></a>

#### DIDDocument.createDIDDocument(did) ⇒ <code>DIDDocument</code>
<p>Creates a new DID Document from scratch. This is only for new Identities.</p>

**Kind**: static method of [<code>DIDDocument</code>](#module_DID..DIDDocument)  
**Returns**: <code>DIDDocument</code> - <p>A newly created class instance of DIDDocument.</p>  

| Param | Type | Description |
| --- | --- | --- |
| did | <code>DID</code> | <p>The DID that will point towards this document.</p> |

    
* [IOTA](#module_IOTA)
    * _static_
        * [.MAM_MODE](#module_IOTA.MAM_MODE)
        * [.MAMPublisher](#module_IOTA.MAMPublisher) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * _inner_
        * [~MAMPublisher](#module_IOTA..MAMPublisher)
            * [new MAMPublisher(provider, seed, [mode], [sideKey], [securityLevel])](#new_module_IOTA..MAMPublisher_new)
            * [.PublishMessage(message, [tag], [mwm])](#module_IOTA..MAMPublisher+PublishMessage) ⇒ <code>Promise.&lt;string&gt;</code>
            * [.UpdateMAMState(nextRoot, channelStart)](#module_IOTA..MAMPublisher+UpdateMAMState)
            * [.ExportState()](#module_IOTA..MAMPublisher+ExportState) ⇒ <code>MAMState</code>
        * [~MAM_MODE](#module_IOTA..MAM_MODE)

<a name="module_IOTA.MAM_MODE"></a>

### IOTA.MAM\_MODE
<p>An interface for the state of the MAM Channel. Used for exporting the MAM state towards local storage.</p>

**Kind**: static property of [<code>IOTA</code>](#module_IOTA)  
<a name="module_IOTA.MAMPublisher"></a>

### IOTA.MAMPublisher ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
<p>Reads the MAM stream and outputs all the messages from root till the end.</p>

**Kind**: static property of [<code>IOTA</code>](#module_IOTA)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - <p>Returns a Promise for an array of messages. Every item the array is the message from a MAM bundle. Returns Error on failure.</p>  

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>string</code> | <p>A URL to the node that will be used for Tangle interaction.</p> |
| root | <code>string</code> | <p>The root of the MAM channel that reading will start from.</p> |
| [mode] | <code>MAM\_MODE</code> | <p>The mode of the channel. Defaults to Private mode.</p> |
| [sideKey] | <code>string</code> | <p>Encryption key for the restricted MAM mode. MUST supply a sideKey when on restricted mode. Otherwise ignored.</p> |
| [securityLevel] | <code>number</code> | <p>The security level for the MAM stream. 1-3 is allowed. Default to 2.</p> |

<a name="module_IOTA..MAMPublisher"></a>

### IOTA~MAMPublisher
<p>An helper class to wrap writing data to the Tangle in a MAM Transaction.</p>

**Kind**: inner class of [<code>IOTA</code>](#module_IOTA)  

* [~MAMPublisher](#module_IOTA..MAMPublisher)
    * [new MAMPublisher(provider, seed, [mode], [sideKey], [securityLevel])](#new_module_IOTA..MAMPublisher_new)
    * [.PublishMessage(message, [tag], [mwm])](#module_IOTA..MAMPublisher+PublishMessage) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.UpdateMAMState(nextRoot, channelStart)](#module_IOTA..MAMPublisher+UpdateMAMState)
    * [.ExportState()](#module_IOTA..MAMPublisher+ExportState) ⇒ <code>MAMState</code>

<a name="new_module_IOTA..MAMPublisher_new"></a>

#### new MAMPublisher(provider, seed, [mode], [sideKey], [securityLevel])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| provider | <code>string</code> |  | <p>A URL to the node that will be used for Tangle interaction.</p> |
| seed | <code>string</code> |  | <p>The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.</p> |
| [mode] | <code>MAM\_MODE</code> |  | <p>The mode of the channel. Defaults to Private mode.</p> |
| [sideKey] | <code>string</code> |  | <p>Encryption key for the restricted MAM mode. MUST supply a sideKey when on restricted mode. Otherwise ignored.</p> |
| [securityLevel] | <code>number</code> | <code>2</code> | <p>The security level for the MAM stream. 1-3 is allowed. Default to 2.</p> |

<a name="module_IOTA..MAMPublisher+PublishMessage"></a>

#### mamPublisher.PublishMessage(message, [tag], [mwm]) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Publishes a new message to the MAM stream.</p>

**Kind**: instance method of [<code>MAMPublisher</code>](#module_IOTA..MAMPublisher)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <p>A promise for the root of the MAM transaction. On failure, returns an Error.</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>string</code> |  | <p>An Ascii encoded message to Publish.</p> |
| [tag] | <code>string</code> |  | <p>The transaction Tag for the MAM transaction. Allows for filtering.</p> |
| [mwm] | <code>number</code> | <code>14</code> | <p>The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet.</p> |

<a name="module_IOTA..MAMPublisher+UpdateMAMState"></a>

#### mamPublisher.UpdateMAMState(nextRoot, channelStart)
<p>Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.</p>

**Kind**: instance method of [<code>MAMPublisher</code>](#module_IOTA..MAMPublisher)  

| Param | Type | Description |
| --- | --- | --- |
| nextRoot | <code>string</code> | <p>The nextRoot of the Channel.</p> |
| channelStart | <code>number</code> | <p>The starting index of the channel.</p> |

<a name="module_IOTA..MAMPublisher+ExportState"></a>

#### mamPublisher.ExportState() ⇒ <code>MAMState</code>
<p>Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.</p>

**Kind**: instance method of [<code>MAMPublisher</code>](#module_IOTA..MAMPublisher)  
**Returns**: <code>MAMState</code> - <p>The state of the MAM channel. All you need to store for later synching.</p>  
<a name="module_IOTA..MAM_MODE"></a>

### IOTA~MAM\_MODE
<p>An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.</p>

**Kind**: inner property of [<code>IOTA</code>](#module_IOTA)  
