import { Button } from '../components/Button';

export function Login() {
    return (
        <div className='h-full flex flex-col items-center justify-center gap-4'>
            <h1>Wally</h1>
            <p>Login or create an account to start using Wally!</p>
            {/* TODO: google oauth */}
            <Button variant='primary'>Sign in with Google</Button>
        </div>
    );
}
