const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');  // Requiere el módulo path para rutas de archivo
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

app.use(bodyParser.json());

// Sirve los archivos estáticos desde la carpeta "front"
app.use(express.static(path.join(__dirname, '../front')));

// Rutas API
app.get('/api/clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/clientes', (req, res) => {
    const { nombre, email, destino } = req.body;
    const sql = 'INSERT INTO clientes (nombre, email, destino) VALUES (?, ?, ?)';
    db.query(sql, [nombre, email, destino], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, nombre, email, destino });
        console.log('Cliente agregado con exito.');
    });
});

app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM clientes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
        console.log('Cliente eliminado con exito.')
    });
});

app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, destino } = req.body;
    const sql = 'UPDATE clientes SET nombre = ?, email = ?, destino = ? WHERE id = ?';
    db.query(sql, [nombre, email, destino, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ id, nombre, email, destino });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
