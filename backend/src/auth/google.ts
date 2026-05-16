import { Request, Response, Router } from 'express';
import { randomBytes } from 'crypto';
import { parse } from 'cookie';
import z from 'zod';
import { UserService, SessionService } from '../services/index.js';

const googleUserProfileSchema = z.object({
    id: z.string(),
    email: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    picture: z.string(),
});

export type GoogleUserProfile = z.infer<typeof googleUserProfileSchema>;

const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

export class GoogleAuth {
    private client_id: string;
    private client_secret: string;
    private redirect_uri: URL;
    private userService: UserService;
    private sessionService: SessionService;

    constructor(
        client_id: string,
        client_secret: string,
        redirect_uri: URL,
        userService: UserService,
        sessionService: SessionService,
    ) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;
        this.userService = userService;
        this.sessionService = sessionService;
    }

    public buildRouter() {
        return Router()
            .get('/', (req, res) => this.login(req, res))
            .get('/callback', (req, res) => this.callback(req, res));
    }

    private login(req: Request, res: Response) {
        const state = randomBytes(32).toString('hex');

        const params = new URLSearchParams({
            client_id: this.client_id,
            redirect_uri: 'http://localhost:8000/auth/google/callback',
            response_type: 'code',
            scope: 'profile email',
            state: state,
        });
        const url = OAUTH_URL + '?' + params.toString();

        res.cookie('state', state, { maxAge: 5 * 60 * 1000 });

        const redirect = req.query.redirect?.toString();
        if (redirect) {
            res.cookie('redirect', redirect, { maxAge: 5 * 60 * 1000 });
        }

        res.redirect(url);
    }

    private async callback(req: Request, res: Response) {
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

        const accessToken = await this.fetchAccessToken(code);
        const userProfile = await this.fetchUserProfile(accessToken);

        const user = await this.userService.getOrCreateFromGoogle(userProfile);
        const sessionSecret = await this.sessionService.createSession(user.id);

        res.cookie(SessionService.SESSION_COOKIE, sessionSecret);

        const redirect = cookies['redirect'];
        if (redirect) {
            res.redirect(redirect);
        } else {
            res.json(userProfile);
        }
    }

    private async fetchAccessToken(code: string) {
        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.client_id,
                client_secret: this.client_secret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: this.redirect_uri.href,
            }).toString(),
        });

        const json = await res.json();
        const token = json.access_token;

        if (typeof token === 'string') {
            return token;
        } else {
            throw new Error(
                'Returned JSON is missing access_token key: ' + json,
            );
        }
    }

    private async fetchUserProfile(token: string) {
        const res = await fetch(USER_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const json = await res.json();
        return googleUserProfileSchema.parse(json);
    }
}
