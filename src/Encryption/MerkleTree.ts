//Maybe place functions again 

export class MerkleTree {

    private concat: any
    public leaves: Buffer[] | Array<any>
    public layers: Array<any>
    public layerIndex: Number

    constructor(leaves: Buffer[] | Array<any>, concat: any) {
        this.leaves = leaves
        this.concat = concat
        this.layers = [this.leaves]
        this.BuildTree(this.leaves)
    }

    public GetRoot() {
        return this.layers[this.layers.length - 1][0]
    }

    private BuildTree(nodes: Buffer[] | Array<any>) {
        while (nodes.length > 1) {
            const layerIndex = this.layers.length
            this.layers.push([])
            for (let i = 0; i < nodes.length; i += 2) {
                //If last node in layer, keep hash 
                //Concatenate it with itself and hash it !!!!
                if (i + 1 === nodes.length) {
                    if (nodes.length % 2 === 1) {
                        this.layers[layerIndex].push(nodes[i])
                        continue
                    }
                }
                const left = nodes[i]
                const right = i + 1 == nodes.length ? left : nodes[i + 1];
                const hash = this.concat(left, right)

                this.layers[layerIndex].push(hash)
            }
            nodes = this.layers[layerIndex]
        }
    }

    //CHANGEEE get proof change name more descriptive getrequiredhashesforproof
    //CHANGEEE Allow index array 
    public GetProof(index: number): Array<any> {
        var proof = []
        //Check if index is on left side: even left, uneven right 
        //When idx on left side, push idx of right side into proof 
        //When idx on right side, push idx of left side into proof 
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i]

            //CHANGEEE convert to boolean, avoid true : false below 
            const isRightNode = index % 2
            //When on left side add one to index to get pair from right side 
            //Und andersrum 
            const pairIndex = (isRightNode ? index - 1 : index + 1)
            if (pairIndex < layer.length) {
                proof.push({
                    data: layer[pairIndex],
                    left: isRightNode ? true : false
                })
            }
            // set index to parent index
            index = (index / 2) | 0
        }
        return proof
    }
}
