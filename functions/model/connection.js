var mongoClient = require("mongodb").MongoClient;

function isObject(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object;
}
var database;
module.exports = class mongoDbClient {
    
    constructor(dbName) {
        this.uri = "mongodb+srv://chipaquito:appermuta@tcc-app.zxk4j.mongodb.net/site_appermuta?retryWrites=true&w=majority";
        this.dbName = dbName;
        this.db;
        this.conn;
    }

    async connect(onSuccess, onFailure){
        try {
            this.conn = new mongoClient(this.uri);
            await this.conn.connect();

            this.db = this.conn.db(this.dbName);
            console.log("MongoClient Connection successfull.");
            await onSuccess(this.db);
        }
        catch(ex) {
            return console.log("Deu erro: ",ex);
            onFailure(ex);
        }
        finally {
            await this.conn.close();
            console.log("\nConexão encerrada.");
        }
    }

    async getAllDocs(collectionsName) {
        try {
            const cursor =  await this.db.collection(collectionsName).find().sort({ last_review: -1 }).limit(10);
            const results = await cursor.toArray();

            if (results.length > 0) {
                console.log("Documentos encontrados!");
                results.forEach((result, i) => {
                    console.log();
                    console.log(`${i + 1}. nome: ${result.nome}`);
                    console.log(`   _id: ${result._id}`);
                    console.log(`   sobrenome: ${result.sobreNome}`);
                    console.log(`   idade: ${result.idade}`);
                    console.log(`   cpf: ${result.cpf}`);
                });
                /* results.forEach((result, i) => {
                    let date = new Date(result.last_review).toDateString();
                    console.log();
                    console.log(`${i + 1}. name: ${result.name}`);
                    console.log(`   _id: ${result._id}`);
                    console.log(`   bedrooms: ${result.bedrooms}`);
                    console.log(`   bathrooms: ${result.bathrooms}`);
                    console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
                }); */
            } else {
                console.log("Achei não pai");
            }
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async insertUser(newUser) {
        if (isObject(newUser)) {
            try {
                const result = await this.db.collection('users').insertOne(newUser);
                return console.log("Usuário cadastrado com sucesso!\n'Id': ",result.insertedId);
            } catch (error) {
                return console.log("Deu erro: ",error);
            }
        } else {
          return console.log("Parâmetro inserido não é um objeto ou está vazio!");
        }
    }

    async getNextSequence(coll) {
        return await this.db.collection("counters").findOneAndUpdate({
            _id: coll
        },
        {$inc: {seq: 1}},
        {projections: {seq: 1},
            upsert: true,
            returnOriginal: false
        }
        );
    }

    async insertDocumentWithIndex(coll, doc) {
        try {
        if(!isObject(doc)){
            throw Error("mongoClient.insertDocumentWithIndex: document is not an object");
            return;
        }
        var index = await this.getNextSequence(coll);
        doc.idx = index.value.seq;
        return await this.db.collection(coll).insertOne(doc);
        }
        catch(e) {
        logger.error("mongoClient.insertDocumentWithIndex: Error caught,", e);
        return Promise.reject(e);
        }
    }

    async findDocFieldsByFilter(coll, query, projection, lmt) {
        if(!query){
        throw Error("mongoClient.findDocFieldsByFilter: query is not an object");
        }
        return await this.db.collection(coll).find(query, {
        projection: projection || {},
        limit: lmt || 0
        }).toArray();
    }

    async findDocByAggregation(coll, query) {
        if(!query.length){
        throw Error("mongoClient.findDocByAggregation: query is not an object");
        }
        return this.db.collection(coll).aggregate(query).toArray();
    }

    async getDocumentCountByQuery(coll, query) {
        return this.db.collection(coll).estimatedDocumentCount(query || {})
    }

    async findOneAndUpdate(coll, query, values, option) {
        if(!(isObject(values) && isObject(query))){
        throw Error("mongoClient.UpdateDocument: values and query should be an object");
        }
        return this.db.collection(coll).findOneAndUpdate(query, {$set : values}, option || {})
    }

    async modifyOneDocument(coll, query, values, option) {
        if(!(isObject(values) && isObject(query))){
        throw Error("mongoClient.ModifyOneDocument: values, query and option should be an object");
        }
        return await this.db.collection(coll).updateOne(query, values, option || {})
    }

    async close() {
        return await this.db.close();
    }
}

/* module.exports = {
  mongoDbClient: mongoDbClient
} */

/* const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://chipaquito:appermuta@tcc-app.zxk4j.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
export const client = new MongoClient(url);

export default async function openDataBase(function procedure) {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        procedure()

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

openDataBase().catch(console.dir); */