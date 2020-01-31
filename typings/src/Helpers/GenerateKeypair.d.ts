import { RSAKeypair } from "../Encryption/RSAKeypair";
import { ECDSAKeypair } from "../Encryption/ECDSAKeypair";
export declare function GenerateRSAKeypair(): Promise<RSAKeypair>;
export declare function GenerateECDSAKeypair(): Promise<ECDSAKeypair>;
