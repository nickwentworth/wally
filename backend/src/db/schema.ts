import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
    id: serial().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    first: varchar('first_name', { length: 255 }),
});
