import { Link, useLocation } from 'react-router';
import { Icon, IconType } from '../common';

type NavBarLinkProps = {
    href: string;
    text: string;
    icon: IconType;
};

export function NavBarLink(props: NavBarLinkProps) {
    const location = useLocation();
    const isActive = props.href === location.pathname;

    return (
        <Link
            to={props.href}
            className={
                'flex items-center gap-2 p-3 rounded-lg ' +
                (isActive
                    ? 'bg-white font-semibold drop-shadow-xs'
                    : 'hover:bg-cream-200')
            }
        >
            <Icon
                icon={props.icon}
                size={18}
                className={isActive ? 'text-moss-500' : ''}
            />
            {props.text}
        </Link>
    );
}
