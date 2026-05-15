import { MySql2Database } from 'drizzle-orm/mysql2';
import { sessions } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export class SessionService {
    private db: MySql2Database;

    public static readonly SESSION_COOKIE = 'session';

    private static readonly SESSION_TTL_MS = 1000 * 60 * 60;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async createSession(userId: number) {
        const token = randomBytes(24).toString('base64');

        await this.db.insert(sessions).values({
            secret: sql`UNHEX(SHA1(${token}))`,
            userId,
        });

        return token;
    }

    async validateSession(token: string) {
        if (!token) {
            return null;
        }

        const session = await this.db
            .select({ userId: sessions.userId, createdAt: sessions.createdAt })
            .from(sessions)
            .where(eq(sessions.secret, sql`UNHEX(SHA1(${token}))`))
            .then((rs) => (rs.length > 0 ? rs[0] : null));

        if (!session) {
            return null;
        }

        const now = new Date();
        const ageMs = now.getTime() - session.createdAt.getTime();
        if (ageMs > SessionService.SESSION_TTL_MS) {
            return null; // TODO: cleanup session
        }

        return session;
    }
}
