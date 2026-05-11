import { drizzle } from 'drizzle-orm/mysql2';
import express from 'express';
import { users } from './db/schema.js';

const server = express();

const db = drizzle(process.env.MYSQL_URL!);

server.get('/', async (req, res) => {
    const me = await db
        .select()
        .from(users)
        .then((rs) => rs[0]);

    res.send(`Hello ${me.first}!`);
});

server.listen(8000, () => console.log('Listening on http://localhost:8000'));
