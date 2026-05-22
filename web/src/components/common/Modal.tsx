import { useState } from 'react';

type ModalControls = ReturnType<typeof useModal>;

type ModalProps = React.PropsWithChildren<{
    controls: ModalControls;
}>;

export function Modal(props: ModalProps) {
    function onBackgroundClick(e: React.MouseEvent) {
        // Only close if the user clicked the actual background element
        if (e.target === e.currentTarget) {
            props.controls.close();
        }
    }

    if (!props.controls.isOpen) {
        return;
    }

    return (
        <div
            className='fixed inset-0 bg-black/10 backdrop-blur-[3px] flex items-center justify-center'
            onClick={onBackgroundClick}
        >
            <div className='w-120 bg-cream-50 rounded-lg drop-shadow-xl'>
                {props.children}
            </div>
        </div>
    );
}

export function useModal() {
    const [formState, setFormState] = useState({
        isOpen: false,
    });

    const open = () => setFormState({ isOpen: true });
    const close = () => setFormState({ isOpen: false });

    return {
        open,
        close,
        ...formState,
    };
}
