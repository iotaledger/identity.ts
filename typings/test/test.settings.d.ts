import { GenerateRSAKeypair } from '../src/Helpers/GenerateKeypair';
export declare const provider: string;
export declare const TestProofTypes: {
    name: string;
    keyGenFunc: typeof GenerateRSAKeypair;
}[];
export declare function delay(ms: number): Promise<unknown>;
