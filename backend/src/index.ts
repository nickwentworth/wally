import { drizzle } from 'drizzle-orm/mysql2';
import express from 'express';
import { users } from './db/schema.js';
import mysql from 'mysql2/promise';
import { buildApiHandler } from './api/index.js';

const server = express();

const mysqlPool = mysql.createPool(process.env.MYSQL_URL!);
const db = drizzle(mysqlPool);

server.use('/api', buildApiHandler(db));

server.get('/', async (req, res) => {
    const me = await db
        .select()
        .from(users)
        .then((rs) => rs[0]);

    res.send(`Hello ${me.first}!`);
});

server.listen(8000, () => console.log('Listening on http://localhost:8000'));
