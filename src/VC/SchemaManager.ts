import * as fs from 'fs';

//TODO: Add DID's to trust
class SchemaManager {
    private static instance : SchemaManager;
    private schemas : Map<string,{}>;

    private constructor() {
        this.schemas = new Map<string, {}>();

        //Load all default Schemas
        let filePaths : string[] = fs.readdirSync("./Schemas");
        for(let i=0; i < filePaths.length; i++) {
            let fileName = filePaths[i].substr(filePaths[i].lastIndexOf('/'));
            fileName = fileName.substr(0, fileName.lastIndexOf('.'));
            this.AddSchemaFromFile(fileName, filePaths[i]);
        }
    }

    public AddSchemaFromFile(name : string, path : string) {
        let fileData : string = fs.readFileSync(path, "utf8");
        console.log(fileData);
        this.schemas.set(name, JSON.parse(fileData));
    }

    static GetInstance() : SchemaManager {
        if(!SchemaManager.instance) {
            SchemaManager.instance = new SchemaManager();
        }
        return SchemaManager.instance;
    }
}