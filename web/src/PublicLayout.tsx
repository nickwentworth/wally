import { Outlet } from 'react-router';

export function PublicLayout() {
    return (
        <div className='w-dvw h-dvh'>
            <Outlet />
        </div>
    );
}
