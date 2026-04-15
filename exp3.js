const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password@123',
    database: 'company'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected');
});

app.get('/', (req, res) => {
    res.send(`
        <html><body style="font-family: Arial">
        <h1>Employee search</h1>
        <form action="/search" method="post">
            Employee ID: <input type="number" name="id" required> <br><br>
            <button type="submit">Search</button>
        </form>
        </body></html>
    `);
});

app.post('/search', (req, res) => {
    const id = req.body.id;
    db.query('SELECT * FROM employees WHERE id=?', [id], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            const e = results[0];
            res.send(`
                <html><body style="font-family: Arial">
                <h1>Employee found</h1>
                <p><b>ID:</b> ${e.id}</p>
                <p><b>Name:</b> ${e.name}</p>
                <p><b>Position:</b> ${e.position}</p>
                <p><b>Salary:</b> ${e.salary}</p>
                <p><b>Email:</b> ${e.email}</p>
                <a href="/">Back</a>
                </body></html>
            `);
        } else {
            res.send('<h1>Employee not found</h1><a href="/">Back</a>');
        }
    });
});

app.listen(3000, () => {
    console.log('Employee Search App running on port 3000');
});
