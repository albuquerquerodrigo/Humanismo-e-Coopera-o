const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const postItRoutes = require('./routes/postits');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/postits', postItRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Função para ler o arquivo JSON
function readPostIts() {
    const data = fs.readFileSync('./data/postits.json');
    return JSON.parse(data);
}

// Função para salvar os Post-Its no arquivo JSON
function savePostIts(postIts) {
    fs.writeFileSync('./data/postits.json', JSON.stringify(postIts, null, 2));
}
