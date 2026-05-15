import { SessionService } from './session.js';
import { UserService } from './user.js';

export type Services = {
    user: UserService;
    session: SessionService;
};

export { UserService, SessionService };
