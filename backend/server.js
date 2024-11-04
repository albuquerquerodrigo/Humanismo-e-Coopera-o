const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error('Erro ao conectar com o banco de dados:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
});

// Criação da tabela, se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS postIts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        class TEXT,
        shift TEXT,
        content TEXT,
        color TEXT,
        room TEXT
    )
`);

// Rota para salvar um Post-It
app.post('/api/postIts', (req, res) => {
    const { name, class: className, shift, content, color, room } = req.body;
    db.run(
        `INSERT INTO postIts (name, class, shift, content, color, room) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, className, shift, content, color, room],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Rota para carregar os Post-Its de uma sala
app.get('/api/postIts', (req, res) => {
    const { room } = req.query;
    db.all(`SELECT * FROM postIts WHERE room = ?`, [room], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para excluir um Post-It
app.delete('/api/postIts/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM postIts WHERE id = ?`, id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post-It deletado com sucesso!' });
    });
});

// Iniciar o servidor
app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
