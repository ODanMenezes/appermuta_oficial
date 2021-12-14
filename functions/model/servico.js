const { ObjectId } = require("mongodb");
var mongoDbClient =  require("./connection");
var dbConnection = new mongoDbClient('site_appermuta');

function isObject(obj) {
    return Object.keys(obj).length > 0 && obj.constructor === Object;
}

module.exports = class Servico {
    
    /**
     * @param {string} nome - O nome do servico
     * @param {ObjectId} autorId - O id do prestador
     * @param {Array} formaDePag - As formas de pagamento aceitas
     * @param {string} descricao - Descricao breve dos servicos
     */
    constructor(db, nome, autorId, formaDePag, descricao) {
        this.db = db,
        this.coll = this.db.collection('services'),
        this.nome = nome,
        this.autorId = autorId,
        this.formaDePag = formaDePag,
        this.descricao = descricao
        // this.dataCriacao = dataCriacao
    }

    //*******Exportar Dados*******//

    //Use apenas para cadastrar
    exportarObjServico() {
        let Servico = {
            nome: this.nome,
            autorId: this.autorId,
            formaDePag: this.formaDePag,
            descricao: this.descricao,
            $currentDate: { dataCriacao: true}
        }
        return Servico;
    }

    async exportarServico(idServico) {
        try {
            const results = await this.coll.find({_id: { $toObjectId: idServico }});
            return results;
        } catch (error) {
            return console.log("Erro ao exportar um serviço: ",error);
        }
    }

    async exportarTodosServicos() {
        try {
            const cursor =  await this.coll.find().sort({ nome: 1 });
            const results = await cursor.toArray();

            return results;
        } catch (error) {
            return console.log("Erro ao exportar serviços: ",error);
        }
    }

    async exportarAutor(idAutor) {
        try {
            const results = await this.db.collection('users').find({_id: { $toObjectId: idAutor }});
            return results;
        } catch (error) {
            return console.log("Erro ao exportar autor: ",error);
        }
    }

    //*******CRUD*******//

    async inserirServico(novoServico) {
        if (isObject(novoServico)) {
            try {
                const result = await this.coll.insertOne(novoServico);
                return console.log("Usuário cadastrado com sucesso!\n'_Id': ",result.insertedId);
            } catch (error) {
                return console.log("Deu erro: ",error);
            }
        } else {
          return console.log("Parâmetro inserido não é um objeto ou está vazio!");
        }
    }

    async atualizarServico(idServico, servicoAtualizado) {
        try {
            const filtro = {
                _id: { $toObjectId: idServico }
            }

            const update = {
                $set: servicoAtualizado
            }

            const options = { 
                returnNewDocument: true
            }

            const resultado =  await this.coll.findOneAndUpdate(filtro, update, options);

            console.log(`Usuário atualizado com sucesso!\n ${resultado}`);
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async deletarServico(idServico) {
        try {
            const filtro = {
                _id: { $toObjectId: idServico }
            }

            const results = await this.coll.deleteOne(filtro);
            console.log(`Usuário deletado com sucesso!\nQuantidade de docs deletados: ${results.deletedCount}`);
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

    async listarTodosServicos() {
        try {
            const results = await this.exportarTodosServicos();

            if (results.length > 0) {
                console.log("Documentos encontrados!");
                results.forEach((result, i) => {
                    let date = new Date(result.dataCriacao).toDateString();
                    console.log();
                    console.log(`${i + 1}. _id: ${result._id}`);
                    console.log(`   título: ${result.nome}`);
                    console.log(`   nomeAutor: ${this.exportarAutor(result.idAutor)}`);
                    console.log(`   descrição: ${result.descricao}`);
                    console.log(`   data de criação: ${new Date(result.dataCriacao).toDateString()}`);
                });
            } else {
                console.log("A coleção 'services' está vazia!");
            }
        } catch (error) {
            return console.log("Deu erro: ",error);
        }
    }

}