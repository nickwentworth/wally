import { Router } from 'express';
import { GoogleAuth } from './google.js';
import { Services } from '../services/index.js';

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
            services.user,
            services.session,
        );

        authRouter.use('/google', google.buildRouter());
    }

    return authRouter;
}
