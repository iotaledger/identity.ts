import { GenerateRSAKeypair } from '../src/Helpers/GenerateKeypair';
export declare const provider: string;
export declare const mwm: number;
export declare const depth: number;
export declare const security: number;
export declare const TestProofTypes: {
    name: string;
    keyGenFunc: typeof GenerateRSAKeypair;
}[];
export declare function delay(ms: number): Promise<unknown>;
