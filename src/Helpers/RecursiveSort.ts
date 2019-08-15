
export function RecursiveSort( data : any ) {
    if(!Array.isArray(data) && typeof(data) == "object") {
        let ordered = {};
        Object.keys(data).sort().forEach( function(key) {
            ordered[key] = RecursiveSort(data[key]);
        });
        data = ordered;
    }   

    //Recursion Time
    if(Array.isArray(data)) {
        for(let i=0; i < data.length; i++) {
            data[i] = RecursiveSort(data[i]);
        }
    } 
    
    return data;
}