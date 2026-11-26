import React, { useId, useRef, useState } from 'react';
import { buildClass } from '../../lib/utils';

type TriggerArgs = {
    isOpen: boolean;
    popoverId: string;
    anchorName: string;
    open: () => void;
    close: () => void;
};

type ContentArgs = {
    close: () => void;
};

type PopoverProps = {
    trigger: (a: TriggerArgs) => React.ReactNode;
    content: (a: ContentArgs) => React.ReactNode;
    onOpen?: () => void;
    onClose?: () => void;
    placement: 'above' | 'below';
    gap?: 'sm' | 'md' | 'lg';
};

export function Popover(props: PopoverProps) {
    const popoverId = useId();
    const popoverRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const anchor = `--${popoverId}`;

    const open = () => popoverRef.current?.showPopover();
    const close = () => popoverRef.current?.hidePopover();

    return (
        <>
            {props.trigger({
                isOpen,
                popoverId,
                anchorName: anchor,
                open,
                close,
            })}

            <div
                id={popoverId}
                ref={popoverRef}
                popover='auto'
                onToggle={(e) => {
                    const open = e.newState === 'open';
                    setIsOpen(open);
                    if (open) {
                        props.onOpen?.();
                    } else {
                        props.onClose?.();
                    }
                }}
                style={{ positionAnchor: anchor }}
                className={buildClass(
                    'text-inherit bg-transparent w-full overflow-visible',
                    '[position-try-fallbacks:flip-block]',
                    [!props.gap, '[--offset:0px]'],
                    [props.gap === 'sm', '[--offset:--spacing(1)]'],
                    [props.gap === 'md', '[--offset:--spacing(2)]'],
                    [props.gap === 'lg', '[--offset:--spacing(4)]'],
                    [
                        props.placement === 'above',
                        '[position-area:top_center] mb-(--offset)',
                    ],
                    [
                        props.placement === 'below',
                        '[position-area:bottom_center] mt-(--offset)',
                    ],
                )}
            >
                {props.content({ close })}
            </div>
        </>
    );
}
