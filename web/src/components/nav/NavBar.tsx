import { useQuery } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';
import { Button, Icon } from '../common';
import { NavBarLink } from './NavBarLink';

type NavBarProps = {
    onAddTransactionClick: () => void;
};

export function NavBar(props: NavBarProps) {
    // TODO: refine logic and loading handling, just testing for now
    const userQuery = useQuery(trpc.user.me.queryOptions());

    return (
        <nav className='bg-cream-100 border-cream-200 border-r w-60 flex flex-col gap-5 p-5'>
            <h2 className='font-bold'>Wally</h2>

            <Button
                variant='primary'
                left='plus'
                onClick={props.onAddTransactionClick}
            >
                Add
            </Button>

            <div className='flex flex-col gap-px'>
                <NavBarLink
                    href='/transactions'
                    text='Transactions'
                    icon='receipt'
                />

                <NavBarLink href='/categories' text='Categories' icon='tag' />
            </div>

            <div className='mt-auto bg-cream-50 border-cream-200 border rounded-lg flex items-center gap-3 p-4'>
                <div className='bg-moss-200 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                    <strong className='text-xs'>N</strong>
                </div>
                <div className='flex flex-col gap-0.5'>
                    <strong className='text-xs'>
                        {userQuery.data?.first ?? '...'}
                    </strong>
                    <p className='text-xs text-taupe-500'>
                        {userQuery.data?.email ?? '...'}
                    </p>
                </div>
                <a href='/settings' className='ml-auto'>
                    <Icon icon='settings' className='text-taupe-500' />
                </a>
            </div>
        </nav>
    );
}
