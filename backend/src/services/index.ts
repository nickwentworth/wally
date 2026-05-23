import { SessionService } from './session.js';
import { TransactionService } from './transaction.js';
import { UserService } from './user.js';

export type Services = {
    user: UserService;
    session: SessionService;
    txn: TransactionService;
};

export { UserService, SessionService, TransactionService };
