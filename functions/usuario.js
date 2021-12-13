var mongoDbClient =  require("./connection");
var dbConnection = new mongoDbClient('site_appermuta');

function isObject(obj) {
    return Object.keys(obj).length > 0 && obj.constructor === Object;
}

module.exports = class Usuario {
    
    /**
     * @param {string} nome - O nome do usuário
     * @param {string} sobrenome - O sobrenome do usuário
     * @param {string} dataNasc - A data de nascimento do usuário. Formato aceito: AAAA-MM-DD
     * @param {string} cpf - Formato aceito: xxx.xxx.xxx-xx
     * @param {string} rg - Formato aceito: xx.xxx.xxx-xx
     * @param {object} endereco - Um objeto formado apartir da função gerarObjEndereco
     */
    constructor(db, nome, sobrenome, dataNasc, cpf, rg, endereco) {
        this.db = db;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.dataNasc = dataNasc;
        this.cpf = cpf;
        this.rg = rg;
        this.endereco = endereco;
    }

    gerarObjEndereco(logradouro, complemento, numCasa, bairro, cep) {
        let endereco = {
            logradouro: logradouro,
            complemento: complemento,
            numCasa: numCasa,
            bairro: bairro,
            cep: cep
        }
        return endereco;
    }

    exportarObjUsuario() {
        let usuario = {
            nome: this.nome,
            sobrenome: this.sobrenome,
            dataNasc: this.dataNasc,
            cpf: this.cpf,
            rg: this.rg,
            endereco: this.endereco
        }
        return usuario;
    }

    //*******CRUD*******//

    async inserirUsuario(novoUsuario) {
        if (isObject(novoUsuario)) {
            try {
                const result = await this.db.collection('users').insertOne(novoUsuario);
                return console.log("Usuário cadastrado com sucesso!\n'Id': ",result.insertedId);
            } catch (error) {
                return console.log("Deu erro: ",error);
            }
        } else {
          return console.log("Parâmetro inserido não é um objeto ou está vazio!");
        }
    }

    async pegarTodosUsuarios() {
        try {
            const cursor =  await this.db.collection('users').find().sort({ nome: 1 });
            const results = await cursor.toArray();

            return results
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async atualizarUsuarioPorCpf(cpfUsuario, usuarioAtualizado) {
        try {
            const filtro = {
                cpf: cpfUsuario
            }

            const update = {
                $set: usuarioAtualizado
            }

            const options = { 
                returnNewDocument: true
            }

            const resultado =  await this.db.collection('users').findOneAndUpdate(filtro, update, options);

            console.log(`Usuário atualizado com sucesso!\n ${resultado}`);
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async deletarUsuario(cpfUsuario) {
        try {
            const filtro = {
                cpf: cpfUsuario
            }

            const results = await this.db.collection('users').deleteOne(filtro);
            console.log(`Usuário deletado com sucesso!\nQuantidade de docs deletados: ${results.deletedCount}`);
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async listarTodosUsuarios() {
        try {
            const results = await this.pegarTodosUsuarios();

            if (results.length > 0) {
                console.log("Documentos encontrados!");
                results.forEach((result, i) => {
                    let date = new Date(result.dataNasc).toDateString();
                    console.log();
                    console.log(`${i + 1}. _id: ${result._id}`);
                    console.log(`   nome: ${result.nome}`);
                    console.log(`   sobrenome: ${result.sobrenome}`);
                    console.log(`   data de nascimento: ${new Date(result.dataNasc).toDateString()}`);
                    console.log(`   cpf: ${result.cpf}`);
                    console.log(`   rg: ${result.rg}`);
                    /* console.log(`   endereço:`);
                    console.log(`\t\t logradouro: ${result.endereco.logradouro}`);
                    console.log(`\t\t complemento: ${result.endereco.complemento}`);
                    console.log(`\t\t num casa: ${result.endereco.numCasa}`);
                    console.log(`\t\t bairro: ${result.endereco.bairro}`);
                    console.log(`\t\t cep: ${result.endereco.cep}`); */
                });
            } else {
                console.log("A coleção 'users' está vazia!");
            }
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

}