import { Router } from 'express';
import { GoogleAuth } from './google.js';
import { Services } from '../../api/orpc.js';
import { randomBytes } from 'crypto';
import { parse } from 'cookie';
import { SessionService } from './session.service.js';

export function buildAuthRouter(services: Services) {
    const authRouter = Router();

    authRouter.get('/logout', (req, res) => res.send('Unimplemented'));

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (googleClientId && googleClientSecret) {
        const google = new GoogleAuth(
            googleClientId,
            googleClientSecret,
            new URL('http://localhost:8000/auth/google/callback'),
        );

        authRouter.get('/google/', async (req, res) => {
            const redirect = req.query.redirect?.toString();
            if (redirect) {
                res.cookie('redirect', redirect, { maxAge: 5 * 60 * 1000 });
            }

            const state = randomBytes(32).toString('hex');
            res.cookie('state', state, { maxAge: 5 * 60 * 1000 });
            res.redirect(google.buildAuthUrl(state));
        });

        authRouter.get('/google/callback', async (req, res) => {
            const cookies = parse(req.headers.cookie ?? '');

            const stateParam = req.query.state?.toString();
            const stateCookie = cookies['state'];
            if (!stateParam || !stateCookie || stateParam !== stateCookie) {
                return res.status(400);
            }

            const code = req.query.code?.toString();
            if (!code) {
                return res.status(400);
            }

            const googleProfile = await google.fetchUserProfile(code);
            const user =
                await services.user.getOrCreateFromGoogle(googleProfile);
            const sessionSecret = await services.session.createSession(user.id);

            res.cookie(SessionService.SESSION_COOKIE, sessionSecret);

            const redirect = cookies['redirect'];
            if (redirect) {
                res.redirect(redirect);
            } else {
                res.json(googleProfile);
            }
        });
    }

    return authRouter;
}
