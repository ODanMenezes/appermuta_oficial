var mongoDbClient =  require("./model/connection");
var Usuario = require('./model/usuario');

var dbConnection = new mongoDbClient('site_appermuta');

function gerarObjEndereco(logradouro, complemento, numCasa, bairro, cep) {
    let endereco = {
        logradouro: logradouro,
        complemento: complemento,
        numCasa: numCasa,
        bairro: bairro,
        cep: cep
    }
    return endereco;
}
var endereco = gerarObjEndereco("Avenida Deodoro da Fonseca"," ", 2, "Federação", 46587.750);

const onFailure = () => (console.log("Deu merda"));
const onSuccess = (db) => {
    var objUsuario = new Usuario(db, 'Caitano','Almeida','2003-02-27','598.487.213-02','14.123.148-99', endereco);

    var novoAlicia = {
        nome: 'Alicia',
        sobrenome: 'Oliveira',
        dataNasc: '2003-05-15',
        cpf: '597.101.504-24',
        rg: '14.654.857-44'
    }

    var a = objUsuario.inserirUsuario(objUsuario.exportarObjUsuario());
    var b = objUsuario.atualizarUsuarioPorCpf(novoAlicia.cpf, novoAlicia);
    var c = objUsuario.listarTodosUsuarios();

    return a && b && c;
};


dbConnection.connect(onSuccess, onFailure);


/* async function insertData() {

    const db = client.db(dbName);
    // Use the collection "people"
    const col = db.collection("listingsAndReviews");
    // Construct a document                                                                                                                                                              
    let personDocument = {
        "name": { "first": "Alan", "last": "Turing" },
        "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 
        "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  
        "contribs": [ "Turing machine", "Turing test", "Turingery" ],
        "views": 1250000
    }
    // Insert a single document, wait for promise so we can read it back
    const p = await col.insertOne(personDocument);
    // Find one document
    const myDoc = await col.findOne();
    // Print to the console
    console.log(myDoc);
}

openDB(insertData); */