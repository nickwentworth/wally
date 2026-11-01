import { sql } from 'drizzle-orm';
import {
    bigint,
    binary,
    date,
    decimal,
    foreignKey,
    mysqlTable,
    primaryKey,
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

export const categories = mysqlTable(
    'categories',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 255 }).notNull(),
        fgColor: varchar('fg_color', { length: 7 }).notNull(),
        bgColor: varchar('bg_color', { length: 7 }).notNull(),
        icon: varchar('icon', { length: 255 }).notNull(),
        userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete('cascade'),
    ],
);

export const transactions = mysqlTable(
    'transactions',
    {
        id: serial('id').primaryKey(),
        amount: decimal('amount', {
            scale: 2,
            precision: 8,
            mode: 'number',
        }).notNull(),
        date: date('date').notNull(),
        description: varchar('description', { length: 255 }).notNull(),
        recurrence: varchar('recurrence_data', { length: 1024 }),
        recurrenceEndsAt: date('recurrence_ends_at'),
        userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
        categoryId: bigint('category_id', { mode: 'number', unsigned: true }),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [users.id],
        }).onDelete('cascade'),
        foreignKey({
            columns: [table.categoryId],
            foreignColumns: [categories.id],
        }).onDelete('set null'),
    ],
);

export const exceptions = mysqlTable(
    'exceptions',
    {
        masterId: bigint('master_id', {
            mode: 'number',
            unsigned: true,
        }).notNull(),
        exceptionId: bigint('exception_id', {
            mode: 'number',
            unsigned: true,
        }),
        date: date('date').notNull(),
    },
    (table) => [
        primaryKey({
            // Explicitly name PK to fix drizzle-kit push bug
            name: 'exceptions_master_id_date',
            columns: [table.masterId, table.date],
        }),
        foreignKey({
            columns: [table.masterId],
            foreignColumns: [transactions.id],
        }).onDelete('cascade'),
        foreignKey({
            columns: [table.exceptionId],
            foreignColumns: [transactions.id],
        }).onDelete('set null'),
    ],
);
