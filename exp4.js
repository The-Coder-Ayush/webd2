const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password@123',
    database: 'company'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

app.get('/', (req, res) => {
    res.send(`
        <html><body style="font-family: Arial">
        <h1>Generate Salary Receipt</h1>
        <form action="/receipt" method="post">
            Employee ID: <input type="number" name="id" required><br><br>
            <button type="submit">Generate Receipt</button>
        </form>
        </body></html>
    `);
});

app.post('/receipt', (req, res) => {
    const id = req.body.id;
    db.query('SELECT * FROM employees WHERE id=?', [id], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            const e = results[0];
            const date = new Date().toLocaleDateString('en-IN');
            
            res.send(`
                <html><body style="font-family: Arial; text-align: center">
                <h1>Company Salary Receipt</h1>
                <h3>Date: ${date}</h3>
                <p><b>Employee ID:</b> ${e.id}</p>
                <p><b>Name:</b> ${e.name}</p>
                <p><b>Position:</b> ${e.position}</p>
                <p><b>Basic Salary:</b> ${e.salary}</p>
                <p><b>Total Payable:</b> ${e.salary}</p>
                <p><b>Thank You!</b></p>
                <a href="/">Back</a>
                </body></html>
            `);
        } else {
            res.send('<h1>Employee not found</h1><a href="/">Back</a>');
        }
    });
});

app.listen(2000, () => {
    console.log('Salary Receipt App running on port 2000');
});
