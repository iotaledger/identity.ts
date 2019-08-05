import * as crypto from 'crypto';

/**
 * Generate a random seed consisting of A-Z9 characters. 
 * @param length Length of the seed. Default is 81 characters.
 */
export function GenerateSeed(length : number = 81) : string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    let seed : string = '';
    while (seed.length < length) {
        const byte = crypto.randomBytes(1)
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
}