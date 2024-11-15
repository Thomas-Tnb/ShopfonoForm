import express from "express";
import bodyParser from "body-parser";
import Firebird from "node-firebird";

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuração da conexão com o banco Firebird
const dbConfig = {
    host: 'localhost',
    port: 3050, // Porta padrão do Firebird
    database: 'C:/Users/thoma/OneDrive/Documents/ShopfonoForm/FORMDB.FDB', // Caminho completo para o arquivo do banco de dados .fdb
    user: 'sysdba',
    password: 'masterkey',
    lowercase_keys: false, // Opcional: força os nomes das colunas para minúsculas
    role: null, // Opcional: define uma role caso seja necessária
    pageSize: 4096 // Opcional: define o tamanho da página do banco
};

// Função para conectar ao banco de dados Firebird
function connectToDatabase(callback) {
    Firebird.attach(dbConfig, (err, db) => {
        if (err) {
            console.error("Erro ao conectar ao banco de dados Firebird 3.0:", err);
            return callback(err);
        }
        console.log("Conectado ao banco de dados Firebird!");
        callback(null, db);
    });
}

// Rota para capturar os dados do formulário
app.post("/submit-form", (req, res) => {
    const { nome, email, cpf, qtdCanetas } = req.body;

    connectToDatabase((err, db) => {
        if (err) {
            return res.status(500).send("Erro ao conectar ao banco de dados.");
        }

        // Constrói a query de inserção
        const query = `INSERT INTO Pedidos (NOME, EMAIL, CPF, QTDCANETAS) VALUES (?, ?, ?, ?)`;

        db.query(query, [nome, email, cpf, parseInt(qtdCanetas)], (err) => {
            if (err) {
                console.error("Erro ao inserir dados no banco de dados Firebird:", err);
                res.status(500).send("Erro ao gravar dados.");
            } else {
                console.log(`Dados gravados com sucesso! NOME:${nome} EMAIL:${email}, CPF:${cpf}, QTDCANETAS:${qtdCanetas} `);
                res.send(`Dados gravados com sucesso! NOME:${nome} EMAIL:${email}, CPF:${cpf}, QTDCANETAS:${qtdCanetas} `);
            }

            // Fechar a conexão com o banco após a operação
            db.detach();
        });
    });
});

//Inicia o servidor
app.listen(port, () => {
    console.log(`Server rodando em http://localhost:${port}`);
}); 

// Comando SQL para criar a tabela no Firebird
// CREATE TABLE Pedidos (
//     Id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
//     Nome VARCHAR(100),
//     Email VARCHAR(100),
//     Cpf VARCHAR(15),
//     QtdCanetas INTEGER
// );