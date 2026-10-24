import z from 'zod';
import { users } from '../../db/schema.js';

export const UserJson = z.object({
    first: z.string(),
    last: z.string(),
    email: z.string(),
});
type UserJson = z.infer<typeof UserJson>;

export type User = typeof users.$inferSelect;

export function userToJson(user: User): UserJson {
    return {
        // TODO: DB user strings should probably be "not null", just use empty for strings?
        first: user.first ?? '',
        last: user.last ?? '',
        email: user.email,
    };
}
