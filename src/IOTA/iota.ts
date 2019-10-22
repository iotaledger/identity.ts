import { composeAPI, Transaction } from "@iota/core";
import { asciiToTrytes, trytesToAscii } from "@iota/converter";
import { GenerateSeed } from "../Helpers/GenerateSeed";

export function PublishData(address : string, data : string, provider : string, mwm : number = 9) : Promise<readonly Transaction[]> {
    return new Promise<readonly Transaction[]>((resolve, reject) => {
        const iota = composeAPI({provider : provider});
        iota.prepareTransfers(GenerateSeed(), [{value:0, address:address, message: asciiToTrytes(data)}])
        .then((trytes : readonly string[]) => {
            iota.sendTrytes(trytes, 3, mwm)
            .then((result : readonly Transaction[]) => {
                resolve(result);
            })
            .catch((err : Error) => { reject("Error Sending Trytes: " + err)});
        })
        .catch((err : Error) => { reject("Error posting data: " + err);});
    });
}

export function ReadAddress(address : string, provider : string) : Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        const iota = composeAPI({provider : provider});
        iota.findTransactions({addresses : [address]})
        .then((transactionHashes : readonly string[]) => {
            iota.getTransactionObjects(transactionHashes)
            .then((transactions : readonly Transaction[]) => {
                //Group the Bundles
                let bundles : Map<string, Transaction[]> = new Map<string, Transaction[]>();
                for(let i=0; i < transactions.length; i++) {
                    if(bundles.has(transactions[i].bundle)) {
                        bundles.get(transactions[i].bundle).push(transactions[i]);
                    } else {
                        bundles.set(transactions[i].bundle, [transactions[i]]);
                    }
                }

                //Sort the Bundles
                bundles.forEach((value: Transaction[], key : string) => {
                    bundles.set(key, value.sort((a,b) => a.currentIndex - b.currentIndex));
                });

                //Translate the Trytes
                let messages : string[] = [];
                bundles.forEach((value: Transaction[], key : string) => {
                    let message : string = "";
                    for(let i=0; i<value.length; i++) {
                        message += value[i].signatureMessageFragment;
                    }
                    if(message.length % 2) {
                        message += "9";
                    }
                    let asciiMsg : string = trytesToAscii(message);
                    asciiMsg = asciiMsg.replace(/\0/g, '');
                    messages.push(asciiMsg);   
                });
                resolve(messages);
            })
            .catch((err : Error) => { reject("Couldn't read transactions: " + err)});
        })
        .catch((err : Error) => { reject("Couldn't read transactions: " + err)});
    });
}