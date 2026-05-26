import { CategoryService } from './category.js';
import { SessionService } from './session.js';
import { TransactionService } from './transaction.js';
import { UserService } from './user.js';

export type Services = {
    user: UserService;
    session: SessionService;
    txn: TransactionService;
    category: CategoryService;
};

export { CategoryService, UserService, SessionService, TransactionService };
