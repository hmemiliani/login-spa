
## Configuración Inicial

### 1. Inicializar el Proyecto y Configuración del Backend

#### a. Crear el Proyecto y Archivo `package.json`

1. **Crea el directorio del proyecto y navega dentro de él:**
    ```sh
    mkdir spa-app
    cd spa-app
    ```

2. **Inicializa un nuevo proyecto Node.js:**
    ```sh
    npm init -y
    ```

3. **Instala las dependencias necesarias:**
    ```sh
    npm install express body-parser bcryptjs jsonwebtoken pg dotenv
    ```

#### b. Configurar el Servidor con `app.js`

Crea el archivo `app.js` en el directorio raíz del proyecto con el siguiente contenido:

```js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

const secret = process.env.SECRET_KEY;

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: 'User already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
#   l o g i n - s p a 
 
 
