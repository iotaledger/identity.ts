import { GenerateRSAKeypair, GenerateECDSAKeypair } from '../src/Helpers/GenerateKeypair';

export const provider : string = "https://nodes.devnet.iota.org:443";

export const TestProofTypes = [{
    name: "RsaVerificationKey2018",
    keyGenFunc: GenerateRSAKeypair 
 },{
    name: "EcdsaSecp256k1VerificationKey2019",
    keyGenFunc: GenerateECDSAKeypair
 }];

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}