import { expect } from 'chai';
import 'mocha';
import { CreateRandomDID } from '../src/Helpers/CreateRandomDID';

describe('DID Functionalities', function() {
    it('Should create and output a valid DID Document', async function(){
        console.log( (await CreateRandomDID()).GetJSONDIDDocument() );
    })
});