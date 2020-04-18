import { GenerateRSAKeypair, GenerateECDSAKeypair } from '../src/Helpers/GenerateKeypair';

export const provider : string = "https://comnet.iota.works";
export const mwm : number = 10;
export const depth : number = 3;
export const security : number = 2;

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