import { DateTime } from 'luxon';
import z from 'zod';

export type OmitStrict<T, K extends keyof T> = Omit<T, K>;

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
    ? Omit<T, K>
    : never;

export const LuxonDateTime = z.string().transform((s, ctx) => {
    const d = DateTime.fromISO(s);
    if (!d.isValid) {
        ctx.addIssue({ code: 'custom', message: 'Invalid ISO date' });
    }
    return d;
});
