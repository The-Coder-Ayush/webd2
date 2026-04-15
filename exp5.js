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
    console.log('MySQL Connected');
});

app.get('/', (req, res) => {
    res.send(`
        <html><body style="font-family: Arial">
        <h1>Leave Management</h1>
        <a href="/apply">Apply Leave</a> | 
        <a href="/leaves">View All Leaves</a>
        </body></html>
    `);
});

app.get('/apply', (req, res) => {
    res.send(`
        <html><body style="font-family: Arial">
        <h1>Apply for Leave</h1>
        <form action="/apply" method="post">
            Employee ID: <input type="number" name="emp_id" required><br><br>
            Leave Type: <input type="text" name="leave_type" required><br><br>
            Days: <input type="number" name="days" required><br><br>
            Start Date: <input type="date" name="start_date" required><br><br>
            <button type="submit">Submit Leave</button>
        </form>
        </body></html>
    `);
});

app.post('/apply', (req, res) => {
    const { emp_id, leave_type, days, start_date } = req.body;
    
    db.query(
        "INSERT INTO leaves (emp_id, type, days, start_date) VALUES (?, ?, ?, ?)",
        [emp_id, leave_type, days, start_date],
        (err) => {
            if (err) throw err;
            res.send('<h1>Leave Applied Successfully!</h1><a href="/">Home</a>');
        }
    );
});

app.get('/leaves', (req, res) => {
    db.query(`
        SELECT l.*, e.name 
        FROM leaves l 
        JOIN employees e ON l.emp_id = e.id
    `, (err, results) => {
        if (err) throw err;
        
        let html = `
            <html><body>
            <h1>All Leave Applications</h1>
            <table border="1">
            <tr>
                <th>EMP ID</th><th>Name</th><th>Type</th><th>Days</th><th>Date</th><th>Status</th>
            </tr>
        `;
        
        results.forEach(row => {
            html += `
                <tr>
                    <td>${row.emp_id}</td>
                    <td>${row.name}</td>
                    <td>${row.type}</td>
                    <td>${row.days}</td>
                    <td>${row.start_date}</td>
                    <td>${row.status}</td>
                </tr>
            `;
        });
        
        html += '</table><br><a href="/">Home</a></body></html>';
        res.send(html);
    });
});

app.listen(3000, () => {
    console.log('Leave Management App running on port 3000');
});
