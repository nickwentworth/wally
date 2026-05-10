import { Outlet } from 'react-router';
import { NavBar } from './components/nav/NavBar';

export function Layout() {
    return (
        <div className='w-dvw h-dvh flex'>
            <NavBar />
            <div className='bg-cream-50 flex flex-col grow'>
                <Outlet />
            </div>
        </div>
    );
}
