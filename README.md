# Identity.ts 

## Prerequisits

Node v10+

## API Reference

    
* [DID](#module_DID)
    * [~DID](#module_DID..DID)
        * [.GetDID()](#module_DID..DID+GetDID) ⇒ <code>string</code>
        * [.GetSpecificDID()](#module_DID..DID+GetSpecificDID) ⇒ <code>string</code>
        * [.GetUUID()](#module_DID..DID+GetUUID) ⇒ <code>string</code>

<a name="module_DID..DID"></a>

### DID~DID
<p>This class handles the naming conventions of the Decentralized Identifiers (DID). Outputs several different DID formats.</p>

**Kind**: inner class of [<code>DID</code>](#module_DID)  

* [~DID](#module_DID..DID)
    * [.GetDID()](#module_DID..DID+GetDID) ⇒ <code>string</code>
    * [.GetSpecificDID()](#module_DID..DID+GetSpecificDID) ⇒ <code>string</code>
    * [.GetUUID()](#module_DID..DID+GetUUID) ⇒ <code>string</code>

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
