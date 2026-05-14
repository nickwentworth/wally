import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { buildApiHandler } from './api/index.js';
import { buildAuthRouter } from './auth/router.js';

const server = express();

// TODO: fetch from common config?
server.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const mysqlPool = mysql.createPool(process.env.MYSQL_URL!);
const db = drizzle(mysqlPool);

server.use('/api', buildApiHandler(db));
server.use('/auth', buildAuthRouter());

// TODO: fetch port from config
server.listen(8000, () => console.log('Listening on http://localhost:8000'));
