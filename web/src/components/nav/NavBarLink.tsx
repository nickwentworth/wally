import { Link, useLocation } from 'react-router';
import { Icon, IconType } from '../common';
import { buildClass } from '../../lib/utils';

type NavBarLinkProps = {
    href: string;
    text: string;
    icon: IconType;
};

export function NavBarLink(props: NavBarLinkProps) {
    const location = useLocation();
    const isActive = props.href === location.pathname;

    const className = buildClass(
        'flex items-center gap-2 px-3 py-2 rounded-lg',
        [isActive, 'bg-white font-semibold shadow-xs'],
        [!isActive, 'hover:bg-cream-200'],
    );

    return (
        <Link to={props.href} className={className}>
            <Icon
                icon={props.icon}
                size={18}
                className={isActive ? 'text-moss-500' : ''}
            />
            {props.text}
        </Link>
    );
}
