import { sql } from 'drizzle-orm';
import {
    bigint,
    binary,
    foreignKey,
    mysqlTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    first: varchar('first_name', { length: 255 }),
    last: varchar('last_name', { length: 255 }),
    googleId: varchar('google_id', { length: 255 }),
});

export const sessions = mysqlTable(
    'sessions',
    {
        secret: binary('secret', { length: 20 }).notNull().primaryKey(),
        userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
        createdAt: timestamp('created_at')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete('cascade'), // delete all sessions on user deletion
    ],
);
