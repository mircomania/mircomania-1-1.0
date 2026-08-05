import { SmartLink } from '@/utils/SmartLink';

import type { NavItem } from '@/types/navigation';

type NavItemsProps = {
    item: NavItem;
    className?: string;
    onAfterNavigate?: () => void;
};

export function NavItems({ item, className, onAfterNavigate }: Readonly<NavItemsProps>) {
    const handleClick = (): void => {
        onAfterNavigate?.();
    };

    return (
        <SmartLink
            href={item.href}
            className={className}
            title={item.title}
            dataLink={item.dataLink}
            dataCta={item.dataCta}
            onClick={onAfterNavigate ? handleClick : undefined}
        >
            {item.label}
        </SmartLink>
    );
}
