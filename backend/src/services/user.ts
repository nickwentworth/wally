import { MySql2Database } from 'drizzle-orm/mysql2';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { GoogleUserProfile } from '../auth/google.js';

export class UserService {
    private db: MySql2Database;

    constructor(db: MySql2Database) {
        this.db = db;
    }

    async getById(id: number) {
        return await this.db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .then((rs) => (rs.length > 0 ? rs[0] : null));
    }

    async getByEmail(email: string) {
        return await this.db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .then((rs) => (rs.length > 0 ? rs[0] : null));
    }

    async getOrCreateFromGoogle(profile: GoogleUserProfile) {
        const existingUser = await this.getByEmail(profile.email);
        if (existingUser) {
            return existingUser;
        }

        const userId = await this.db
            .insert(users)
            .values({
                email: profile.email,
                first: profile.given_name,
                last: profile.family_name,
                googleId: profile.id,
            })
            .$returningId()
            .then((ids) => ids[0].id);

        return await this.getById(userId).then((u) => u!);
    }
}
