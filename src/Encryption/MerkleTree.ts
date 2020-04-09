import { HashWrapper } from '../Encryption/Hash'

export class MerkleTree {

    public publicLeaves: string[]
    public secretLeaves?: Buffer[]
    public secretLeavePositions?: number[]
    public leaves: Buffer[]
    public layers: Array<Buffer[]>
    public layerIndex: Number

    constructor(publicLeaves: string[], secretLeaves?: Buffer[], secretLeavePositions?: number[]) {
        this.publicLeaves = publicLeaves
        this.secretLeaves = secretLeaves
        this.secretLeavePositions = secretLeavePositions
        this.leaves = this.PrepareLeaves()
        this.layers = [this.leaves]
        this.BuildTree(this.leaves)
    }

    public GetRoot() {
        return this.layers[this.layers.length - 1][0]
    }

    private PrepareLeaves(): Buffer[] {
        let leaves: Buffer[] = []
        this.publicLeaves.forEach((leaf) => {
            leaves.push(HashWrapper(leaf))
        })

        //Combine leaves into one array
        for (let index in this.secretLeavePositions) {
            leaves.splice(this.secretLeavePositions[index], 0, this.secretLeaves[index]);
        }
        return leaves;
    }

    private BuildTree(nodes: Buffer[]) {

        while (nodes.length > 1) {
            const layerIndex = this.layers.length
            this.layers.push([])
            for (let i = 0; i < nodes.length; i += 2) {
                let left
                let right
                //hash last node in uneven tree with itself 
                if (i + 1 === nodes.length && nodes.length % 2 === 1) {
                    left = nodes[i]
                    right = nodes[i]
                } else {
                    left = nodes[i]
                    right = i + 1 == nodes.length ? left : nodes[i + 1];
                }
                const hash = this.concatHash(left, right)
                this.layers[layerIndex].push(hash)
            }
            nodes = this.layers[layerIndex]
        }
    }

    private concatHash(left: Buffer, right: Buffer) {
        if (!left) throw new Error("The concat function expects two hash arguments, the first was not receieved.");
        if (!right) throw new Error("The concat function expects two hash arguments, the second was not receieved.");
        return HashWrapper(Buffer.concat([Buffer.from(left), Buffer.from(right)]))
    }


    //Check if index is on left side: even left, uneven right 
    //When idx on left side, push idx of right side into proof 
    //When idx on right side, push idx of left side into proof 
    public GetHashesForProofComputation(indexArray: number[]): Array<any> {
        let proof = []
        for (let i = 0; i < indexArray.length; i++) {
            let index: number = indexArray[i]
            let singleProof = []
            for (let j = 0; j < this.layers.length; j++) {
                const layer = this.layers[j]

                let isRightNode = index % 2
                //When on left side add one to index to get pair from right side ; vice versa
                let pairIndex = (isRightNode ? index - 1 : index + 1)

                if (pairIndex < layer.length) {
                    singleProof.push({
                        data: layer[pairIndex],
                        left: !!isRightNode
                    })
                }
                //hash last node in uneven tree with itself 
                if (!!isRightNode === false && pairIndex === layer.length && j < (this.layers.length - 1)) {
                    pairIndex = pairIndex - 1

                    singleProof.push({
                        data: layer[pairIndex],
                        left: !!isRightNode
                    })
                }
                // set index to parent index
                index = (index / 2) | 0
            }
            proof.push(singleProof)
        }
        return proof
    }

    public hashProof(node: Buffer | string, proof: { data: Buffer, left: boolean }[]) {
        //check for partial revealing
        let data: Buffer = typeof (node) === 'string' ? HashWrapper(node) : node
        for (let i = 0; i < proof.length; i++) {
            //to position in correct order and hash
            const buffers = proof[i].left ? [Buffer.from(proof[i].data), data] : [data, Buffer.from(proof[i].data)]
            data = Buffer.from(HashWrapper(Buffer.concat(buffers)))
        }
        return data.toString('hex');
    }

    public getHashedRootForLeaves(indexArray: number[]): Array<any> {
        const proofs = this.GetHashesForProofComputation(indexArray)
        let roots: Array<any> = []
        indexArray.forEach((value, index) => {
            let node = this.leaves[value]
            let singleRoot = this.hashProof(node, proofs[index])
            roots.push(singleRoot)
        })
        return roots
    }

    // Verifies a proof with a certain root
    public verify(proof: Array<{ data: Buffer, left: boolean }[]>, node: Buffer[] | string[], root: any[]) {
        let result: boolean[] = []
        for (let i = 0; i < proof.length; i++) {
            let data = this.hashProof(node[i], proof[i])
            result.push(data.toString() === root[i] ? true : false)
        }
        return result;
    }


}