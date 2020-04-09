import 'mocha';
import { assert } from 'chai';
import { HashWrapper, Hash } from '../src/Encryption/Hash'
import { MerkleTree } from '../src/Encryption/MerkleTree';


describe('merkle proof for uneven tree', function () {
  let leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const hashTree = new MerkleTree(leaves);

 let root = hashTree.GetRoot().toString('hex')
 const rootArray: string[] = [root , root]

  describe('for each leaf', function () {
    leaves.forEach((leaf, i) => {
      it(`should return a proof that calculates the root from leaf ${leaf}`, function () {
       if(i <= 8){

        const hashedProof = hashTree.getRootFromLeaf([i, i+1]);
      
        assert.deepEqual(hashedProof, rootArray);
       }
      });
    });
  });
});

describe('merkle proof for even tree', function () {
  let leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const hashTree = new MerkleTree(leaves);

 let root = hashTree.GetRoot().toString('hex')
 const rootArray: string[] = [root , root]

  describe('for each leaf', function () {
    leaves.forEach((leaf, i) => {
      it(`should return a proof that calculates the root from leaf ${leaves[i]}`, function () {
       if(i <= 7){

        const hashedProof = hashTree.getRootFromLeaf([i, i+1]);
      
        assert.deepEqual(hashedProof, rootArray);
       }
      });
    });
  });
});



describe('partial revealing', function () {

  const secretAttribute1 = HashWrapper('I')
  const secretAttribute2 = HashWrapper('J')

  let clearLeaves: any = ['A', 'B', 'C', 'D', 'E', ];
  let hashedLeaves: any = [ secretAttribute1, secretAttribute2]
  const position: number[] = [ 1 , 4 ]

  const hashTree = new MerkleTree(clearLeaves, hashedLeaves, position);

  let root = hashTree.GetRoot().toString('hex')
  const rootArray: string[] = [root , root]

  describe('for each leaf', function () {
    [0,1,2,3,4,5,6].forEach(( i: number) => {
      it(`should return a proof that calculates the root from leaf`, function () {
       if(i <= 5){
        const hashedProof = hashTree.getRootFromLeaf([i, i+1]);
        assert.deepEqual(hashedProof, rootArray);
       }
      });
   });
 });
});


describe('merkle proof verification', function () {
  describe('a given merkle tree', function () {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const tree = new MerkleTree(leaves);
    const root = tree.GetRoot().toString('hex')

    describe('untampered proofs', function () {
      leaves.forEach((_, i) => {
        it(`should verify the proof for leaf index ${i}`, function () {
          const proof = tree.GetHashesForProofComputation([i]);
          const verification = tree.verify(proof, [leaves[i]], [root])
          assert.deepEqual(verification, [ true ]);
        });
      });
    });

    describe('tampered proofs', function () {
      describe('verifying a different node with a proof', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetHashesForProofComputation([2]);
          assert.deepEqual(tree.verify(proof, [leaves[3]], [root]), [ false ]);
        });
      });

      describe('verifying a different root', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetHashesForProofComputation([2]);
          const badRoot = "Hash(Hash(Hash(Hash(A + C) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H))) + Hash(Hash(I + J) + K))";
          assert.deepEqual(tree.verify(proof, [leaves[2]], [badRoot]), [ false ]);
        });
      });

      describe('flipping a nodes position', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetHashesForProofComputation([3]);
          proof[0][1].left = !proof[0][1].left;
          assert.deepEqual(tree.verify(proof, [leaves[3]], [root]), [ false ]);
        });
      });

      describe('editing a hash', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetHashesForProofComputation([5]);
          proof[0][2].data = "Q";
          assert.deepEqual(tree.verify(proof, [leaves[5]], [root]), [ false ]);
        });
      });
    });
  });
});

