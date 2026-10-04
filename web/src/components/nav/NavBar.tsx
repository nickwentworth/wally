import { useQuery } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';
import { Icon } from '../common';
import { NavBarLink } from './NavBarLink';

export function NavBar() {
    // TODO: refine logic and loading handling, just testing for now
    const userQuery = useQuery(trpc.user.me.queryOptions());

    return (
        <nav className='bg-cream-100 border-cream-200 border-r w-55 flex flex-col gap-3 p-3'>
            <div className='flex gap-2 p-2 items-center'>
                <div className='text-white bg-moss-500 p-1.5 rounded-lg'>
                    <Icon icon='utensils' size={16} />
                </div>
                <strong className='font-bold'>Wally</strong>

                <Icon className='ml-auto' icon='close' size={16} />
            </div>

            <div className='mb-auto flex flex-col gap-px'>
                <NavBarLink
                    href='/transactions'
                    text='Transactions'
                    icon='receipt'
                />

                <NavBarLink href='/categories' text='Categories' icon='tag' />
            </div>

            <hr />

            <button
                className='hover:bg-cream-200 flex items-center gap-2 p-2 text-left rounded-lg'
                type='button'
            >
                <span className='bg-moss-200 rounded-full w-8 h-8 flex items-center justify-center shrink-0'>
                    <strong className='text-sm'>N</strong>
                </span>

                <span className='flex flex-col grow min-w-0'>
                    <span className='text-xs'>
                        {userQuery.data?.first ?? '...'}
                    </span>
                    <span className='text-[11px] text-taupe-400 overflow-hidden text-ellipsis'>
                        {userQuery.data?.email ?? '...'}
                    </span>
                </span>

                <Icon icon='settings' className='text-taupe-500 shrink-0' />
            </button>
        </nav>
    );
}
