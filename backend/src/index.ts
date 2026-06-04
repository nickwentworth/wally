import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { buildApiHandler } from './api/router.js';
import { buildAuthRouter } from './auth/router.js';
import { UserService } from './services/user.js';
import { SessionService } from './services/session.js';
import {
    CategoryService,
    Services,
    TransactionService,
} from './services/index.js';
import { Settings } from 'luxon';

Settings.defaultZone = 'utc';

const server = express();

// TODO: fetch from common config?
server.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const mysqlPool = mysql.createPool({
    uri: process.env.MYSQL_URL!,
    timezone: 'Z',
});
mysqlPool.on('connection', (con) => con.query("SET time_zone = 'UTC'"));

const db = drizzle(mysqlPool);

const services = {
    user: new UserService(db),
    session: new SessionService(db),
    txn: new TransactionService(db),
    category: new CategoryService(db),
} satisfies Services;

server.use('/api', buildApiHandler(services));
server.use('/auth', buildAuthRouter(services));

// TODO: fetch port from config
server.listen(8000, () => console.log('Listening on http://localhost:8000'));
