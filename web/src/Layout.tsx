import { Outlet } from 'react-router';
import { Button } from './components/Button';
import { Icon } from './components/Icon';

export function Layout() {
    return (
        <div className='w-dvw h-dvh flex'>
            <nav className='bg-cream-100 border-cream-200 border-r w-60 flex flex-col gap-5 p-5'>
                <h2 className='font-bold'>Wally</h2>

                <Button variant='primary' left='plus'>
                    Add
                </Button>

                <div className='flex flex-col'>
                    <a
                        href='/transactions'
                        className='flex items-center gap-2 p-2'
                    >
                        <Icon icon='receipt' size={18} />
                        <strong>Transactions</strong>
                    </a>
                    <a
                        href='/categories'
                        className='flex items-center gap-2 p-2'
                    >
                        <Icon icon='tag' size={18} />
                        Categories
                    </a>
                </div>

                <div className='mt-auto bg-cream-50 border-cream-200 border rounded-lg flex items-center gap-3 p-4'>
                    <div className='bg-moss-200 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                        <strong className='text-xs'>N</strong>
                    </div>
                    <div className='flex flex-col gap-0.5'>
                        <strong className='text-xs'>Nick</strong>
                        <p className='text-xs text-taupe-500'>nick@test.com</p>
                    </div>
                    <a href='/settings' className='ml-auto'>
                        <Icon icon='settings' className='text-taupe-500' />
                    </a>
                </div>
            </nav>

            <div className='bg-cream-50 flex flex-col grow'>
                <Outlet />
            </div>
        </div>
    );
}
