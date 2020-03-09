import { HashWrapper } from '../Encryption/Hash'


export function concatHash(left: Buffer, right: Buffer) {
    if (!left) throw new Error("The concat function expects two hash arguments, the first was not receieved.");
    if (!right) throw new Error("The concat function expects two hash arguments, the second was not receieved.");
    return HashWrapper(Buffer.concat([Buffer.from(left), Buffer.from(right)]))
}

// the concat function we use to show the merkle root calculation
export function concatLetters(left: string, right: string) {
    return `Hash(${left} + ${right})`;
}


//CHANGEEE FUNCTIONALITY OF THE CLASS
export function hashProof(node: string, proof: { data: Buffer, left: boolean }[]) {
    //check for partial revealing
    let data: Buffer = typeof (node) === 'string'  ? HashWrapper(node) : node

    for (let i = 0; i < proof.length; i++) {
        //to position incorrect order and hash
        const buffers = proof[i].left ? [Buffer.from(proof[i].data), data] : [data, Buffer.from(proof[i].data)]
        data = Buffer.from(HashWrapper(Buffer.concat(buffers)))
    }
    return data;
}


//CHANGEEE FUNCTIONALITY OF THE CLASS
//given a proof, finds the merkle root
export function verify(proof: { data: Buffer, left: boolean }[], node: string, root: any, concat: any) {
    for (let i = 0; i < proof.length; i++) {
        //node = leafnode
        let data = node
        for (let i = 0; i < proof.length; i++) {
            //to position correct order
            const buffers = proof[i].left ? [proof[i].data, data] : [data, proof[i].data]
            data = concat(buffers[0], buffers[1])
        }
        return data === root ? true : false
    }
}

//CHANGEEEE TWO ARRAYS: one hashed others not 
export function hashLeaves(leaves: string[] | Buffer[]): Buffer[] {
    const hashedLeaves = []
    for (let leaf of leaves) {
        typeof (leaf) === 'string' ? hashedLeaves.push(HashWrapper(leaf)) : hashedLeaves.push(leaf)
    }
    return hashedLeaves;
}