document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("addForm");
    const contatosTable = document.getElementById("contatos").getElementsByTagName('tbody')[0];
    const database = JSON.parse(localStorage.getItem("contatos")) || [];

    function refreshTable() {
        contatosTable.innerHTML = "";
        database.forEach(function (contato) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contato.nome}</td>
                <td>${contato.telefone}</td>
                <td>${contato.qnt}</td>
                <td>
                    <button onclick="editContato(${contato.id})">Editar</button>
                    <button onclick="deleteContato(${contato.id})">Excluir</button>
                </td>
            `;
            contatosTable.appendChild(row);
        });
    }

    refreshTable();

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const qnt = document.getElementById("qnt").value;

        const novoContato = {
            id: Date.now(),
            nome: nome,
            telefone: telefone,
            qnt: qnt,
        };

        database.push(novoContato);
        localStorage.setItem("estoque", JSON.stringify(database));
        refreshTable();

        addForm.reset();
    });

    window.editContato = function (id) {
        const contato = database.find((contato) => contato.id === id);
        if (!contato) return;

        const nome = prompt("Novo nome:", contato.nome);
        const telefone = prompt("Novo telefone:", contato.telefone);
        const qnt = prompt("Nova quantidade:", contato.qnt);

        if (nome !== null && telefone !== null) {
            contato.nome = nome;
            contato.telefone = telefone;
            contato.qnt = qnt
            localStorage.setItem("estoque", JSON.stringify(database));
            refreshTable();
        }
    };

    window.deleteContato = function (id) {
        const confirmacao = confirm("Tem certeza de que deseja excluir este contato?");
        if (confirmacao) {
            const index = database.findIndex((contato) => contato.id === id);
            if (index !== -1) {
                database.splice(index, 1);
                localStorage.setItem("estoque", JSON.stringify(database));
                refreshTable();
            }
        }
    };
});

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("estoque.db");

db.serialize(() => {
    // Crie a tabela de contatos, se ela não existir
    db.run(`
        CREATE TABLE IF NOT EXISTS estoque (
            id INTEGER PRIMARY KEY,
            nome TEXT,
            telefone TEXT,
            qnt TEXT,
        )
    `);


});

// Atualize as funções para usar o banco de dados SQLite

function adicionar_contato(nome, telefone, qnt) {
    const sql = "INSERT INTO contato (nome, telefone) VALUES (?, ?)";
    db.run(sql, [nome, telefone,qnt]);
}

function listar_contatos(callback) {
    const sql = "SELECT id, nome, telefone FROM contato";
    db.all(sql, [], (err, rows) => {
        if (err) throw err;
        callback(rows);
    });
}

function atualizar_contato(id, nome, telefone) {
    const sql = "UPDATE contato SET nome = ?, telefone = ? WHERE id = ?";
    db.run(sql, [nome, telefone, id]);
}

function deletar_contato(id) {
    const sql = "DELETE FROM contato WHERE id = ?";
    db.run(sql, [id]);
}
