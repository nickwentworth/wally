import { Button } from '../components/common';
import { buildLoginUrl } from '../lib/auth';

export function Login() {
    return (
        <div className='h-full flex flex-col items-center justify-center gap-4'>
            <h1>Wally</h1>
            <p>Login or create an account to start using Wally!</p>
            <a href={buildLoginUrl()}>
                <Button variant='primary'>Sign in with Google</Button>
            </a>
        </div>
    );
}
