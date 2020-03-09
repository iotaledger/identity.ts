import 'mocha';
import { assert } from 'chai';
import { HashWrapper, Hash } from '../src/Encryption/Hash'
import { MerkleTree } from '../src/Encryption/MerkleTree';
import { hashLeaves, concatHash, concatLetters, hashProof, verify } from '../src/Helpers/MerkleTreeHelper'


describe('merkle', function () {
  it('should handle the base case: [A]', function () {
    const leaves = ['A'];
    const merkleTree = new MerkleTree(leaves, concatLetters);

    assert.equal(merkleTree.GetRoot(), "A");
  });

  it('should create a root from two leaves: [A,B]', function () {
    const leaves = ['A', 'B'];
    const merkleTree = new MerkleTree(leaves, concatLetters);
    assert.equal(merkleTree.GetRoot(), "Hash(A + B)");
  });

  it('should create a root from four leaves: [A,B,C,D]', function () {
    const leaves = ['A', 'B', 'C', 'D'];
    const merkleTree = new MerkleTree(leaves, concatLetters);
    assert.equal(merkleTree.GetRoot(), "Hash(Hash(A + B) + Hash(C + D))");
  });

  it('should create a root from eight leaves: [A,B,C,D,E,F,G,H]', function () {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const merkleTree = new MerkleTree(leaves, concatLetters);
    assert.equal(merkleTree.GetRoot(), "Hash(Hash(Hash(A + B) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H)))");
  });
});




describe('merkle proof', function () {
  let leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  //const root = 'eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526';
  const root = 'b8ca1ce5be42832ce9d29da4285a8cd0b2dd857e3e9c21e2e150305edd17eeba';
  const hashTree = new MerkleTree(hashLeaves(leaves), concatHash);
  const lettersTree = new MerkleTree(leaves.map(HashWrapper), concatLetters);

  describe('for each leaf', function () {
    leaves.forEach((leaf, i) => {
      it(`should return a proof that calculates the root from leaf ${leaves[i]}`, function () {
        const proof = hashTree.GetProof(i);
        const hashedProof = hashProof(leaf, proof).toString('hex');

        if (hashedProof !== root) {
          const lettersProof = lettersTree.GetProof(i);
          console.log(
            "The resulting hash of your proof is wrong. \n" +
            `We were expecting: ${root} \n` +
            `We recieved: ${hashedProof} \n` +
            `In ${leaves.join('')} Merkle tree, the proof of ${leaves[i]} you gave us is: \n` +
            `${JSON.stringify(lettersProof, null, 2)}`
          );
        }
        assert.equal(hashedProof, root);
      });
    });
  });
});


describe('partial revealing', function () {
  let leaves: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const secretAttribute1 = HashWrapper('I')
  const secretAttribute2 = HashWrapper('J')
  leaves.push(secretAttribute1)
  leaves.push(secretAttribute2)
  //const root = 'eb100814abc896ab18bcf6c37b6550eeadeae0c312532286a4cf4be132ace526';
  const root = 'b8ca1ce5be42832ce9d29da4285a8cd0b2dd857e3e9c21e2e150305edd17eeba';
  const hashTree = new MerkleTree(hashLeaves(leaves), concatHash);


  //TO DO TYPING OF HASHPROOF AND ADD TO CLASS 
  describe('for each leaf', function () {
    leaves.forEach((leaf: any, i: number) => {
      it(`should return a proof that calculates the root from leaf ${leaves[i]}`, function () {
        const proof = hashTree.GetProof(i);
        console.log("proof", proof)
        const hashedProof = hashProof(leaf, proof).toString('hex');

        if (hashedProof !== root) {
          console.log("not true")
        }
        assert.equal(hashedProof, root);
      });
    });
  });
});




describe('merkle proof verification', function () {
  describe('a given merkle tree', function () {
    const leaves = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    const root = "Hash(Hash(Hash(Hash(A + B) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H))) + Hash(Hash(I + J) + K))";
    const tree = new MerkleTree(leaves, concatLetters);

    describe('untampered proofs', function () {
      leaves.forEach((_, i) => {
        it(`should verify the proof for leaf index ${i}`, function () {
          const proof = tree.GetProof(i);
          const verification = verify(proof, leaves[i], root, concatLetters)
          assert.equal(verification, true);
        });
      });
    });

    describe('tampered proofs', function () {
      describe('verifying a different node with a proof', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetProof(2);
          assert.equal(verify(proof, leaves[3], root, concatLetters), false);
        });
      });

      describe('verifying a different root', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetProof(2);
          const badRoot = "Hash(Hash(Hash(Hash(A + C) + Hash(C + D)) + Hash(Hash(E + F) + Hash(G + H))) + Hash(Hash(I + J) + K))";
          assert.equal(verify(proof, leaves[2], badRoot, concatLetters), false);
        });
      });

      describe('flipping a nodes position', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetProof(3);
          proof[1].left = !proof[1].left;
          assert.equal(verify(proof, leaves[3], root, concatLetters), false);
        });
      });

      describe('editing a hash', function () {
        it('should not verify the proof', function () {
          let proof = tree.GetProof(5);
          proof[2].data = "Q";
          assert.equal(verify(proof, leaves[5], root, concatLetters), false);
        });
      });
    });
  });
});
