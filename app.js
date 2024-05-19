const express = require('express');
const bodyParser = require('body-parser');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {Pool} = require('pg')

const app = express();
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

app.use(bodyParser.json());
app.use(express.static('public'));

const secret = 'thisisasecret1';

//postgres://username:password@hostname:port/database


app.post('/api/register', async (req, res) =>{
    const {username, password} = req.body;
    const hashedPassword = await bcript.hash(password, 10);
    try{
        const result = await pool.query(
            'INSERT INTO users (username, password) VALULES($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res,status(201).json(result.rows[0]);
    } catch(error) {
        res.status(400).json({error: 'This username already exists.'})
    }
});

app.post('/api/login', async(req, res) =>{
    const {username, password} = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0){
        const user = result.rows[0];
        const isValid = await bcript.compare(password, user.password);
        if (isValid){
            const token = jwt.sign({userId: user.id}, secret, {expiresIn: '24h'});
            res.json({token});
    } else {
        res.status(401).json({error: 'Invalid credentials.'});
    }
} else{
    res.status(401).json({ error: 'Invalid credentials' });
}

});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});