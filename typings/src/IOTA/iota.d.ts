import { Transaction } from "@iota/core";
export declare function PublishData(address: string, data: string, provider: string, mwm?: number): Promise<readonly Transaction[]>;
export declare function ReadAddress(address: string, provider: string): Promise<string[]>;
