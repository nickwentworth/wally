import { useEffect, useRef, useState } from 'react';
import { buildClass } from '../../lib/utils';

export function useDialog() {
    const [isOpen, setIsOpen] = useState(false);

    return {
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen,
    };
}

type DialogControls = ReturnType<typeof useDialog>;

type DialogProps = React.PropsWithChildren<{
    controls: DialogControls;
    placement: 'center' | 'right';
    closeOnBackdropClick?: boolean;
}>;

export function Dialog(props: DialogProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) {
            return;
        }

        if (props.controls.isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!props.controls.isOpen && dialog.open) {
            dialog.close();
        }
    }, [props.controls.isOpen]);

    const dialogClass = buildClass(
        'max-h-none max-w-none bg-cream-50 shadow-md',
        'backdrop:bg-black/10 backdrop:backdrop-blur-[1px]',
        'transition-all transition-discrete ease-out duration-200',
        [props.placement === 'center', 'm-auto'],
        [
            props.placement === 'right',
            'ml-auto h-dvh w-100 translate-x-full open:translate-x-0 starting:open:translate-x-full',
        ],
    );

    return (
        <dialog
            ref={ref}
            className={dialogClass}
            onClick={(e) => {
                if (
                    props.closeOnBackdropClick &&
                    e.target === e.currentTarget
                ) {
                    props.controls.close();
                }
            }}
            onClose={props.controls.close}
        >
            {props.children}
        </dialog>
    );
}
