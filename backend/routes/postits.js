const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/postits.json');

// Função para ler os Post-Its
function readPostIts() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// Função para salvar os Post-Its
function savePostIts(postIts) {
    fs.writeFileSync(dataFilePath, JSON.stringify(postIts, null, 2));
}

// Rota para obter todos os Post-Its
router.get('/', (req, res) => {
    const postIts = readPostIts();
    res.json(postIts);
});

// Rota para adicionar um novo Post-It
router.post('/', (req, res) => {
    const postIts = readPostIts();
    postIts.push(req.body);
    savePostIts(postIts);
    res.status(201).json(req.body);
});

// Rota para editar um Post-It
router.put('/:index', (req, res) => {
    const postIts = readPostIts();
    const index = req.params.index;

    if (index >= 0 && index < postIts.length) {
        postIts[index] = req.body;
        savePostIts(postIts);
        res.json(req.body);
    } else {
        res.status(404).send('Post-It não encontrado');
    }
});

// Rota para deletar um Post-It
router.delete('/:index', (req, res) => {
    const postIts = readPostIts();
    const index = req.params.index;

    if (index >= 0 && index < postIts.length) {
        postIts.splice(index, 1);
        savePostIts(postIts);
        res.status(204).send();
    } else {
        res.status(404).send('Post-It não encontrado');
    }
});

module.exports = router;
