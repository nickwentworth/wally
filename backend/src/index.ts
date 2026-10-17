import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { buildAuthRouter } from './features/auth/auth.routes.js';
import { User, UserService } from './features/auth/user.service.js';
import { SessionService } from './features/auth/session.service.js';
import { TransactionService } from './features/transaction/transaction.service.js';
import { CategoryService } from './features/category/category.service.js';
import { Services } from './api/orpc.js';
import { Settings } from 'luxon';
import { parse } from 'cookie';
import { OpenAPIHandler } from '@orpc/openapi/node';
import { apiRouter } from './api/router.js';

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
    transaction: new TransactionService(db),
    category: new CategoryService(db),
} satisfies Services;

const apiHandler = new OpenAPIHandler(apiRouter);

server.use('/api', async (req, res, next) => {
    const cookies = parse(req.headers.cookie ?? '');
    const sessionToken = cookies[SessionService.SESSION_COOKIE] ?? '';

    let user: User | null = null;

    const session = await services.session.validateSession(sessionToken);
    if (session) {
        user = await services.user.getById(session.userId);
    }

    const { matched } = await apiHandler.handle(req, res, {
        prefix: '/api',
        context: { user, services },
    });

    if (!matched) {
        next();
    }
});

server.use('/auth', buildAuthRouter(services));

// TODO: fetch port from config
server.listen(8000, () => console.log('Listening on http://localhost:8000'));
