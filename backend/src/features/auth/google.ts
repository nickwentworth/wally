import z from 'zod';

const GoogleUserProfile = z.object({
    id: z.string(),
    email: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    picture: z.string(),
});
export type GoogleUserProfile = z.infer<typeof GoogleUserProfile>;

const OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const USER_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';

export class GoogleAuth {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: URL;

    constructor(clientId: string, clientSecret: string, redirectUri: URL) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }

    buildAuthUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri.href,
            response_type: 'code',
            scope: 'profile email',
            state: state,
        });

        return `${OAUTH_URL}?${params.toString()}`;
    }

    async fetchUserProfile(code: string): Promise<GoogleUserProfile> {
        const accessToken = await this.fetchAccessToken(code);

        const res = await fetch(USER_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const json = await res.json();
        return GoogleUserProfile.parse(json);
    }

    private async fetchAccessToken(code: string) {
        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri.href,
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
}
