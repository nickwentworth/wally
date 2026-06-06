import { useEffect, useRef, useState } from 'react';

type UseDropdownOptions = {
    onOpen?: () => void;
    onClose?: () => void;
};

export function useDropdown(opts?: UseDropdownOptions) {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    function open() {
        setIsOpen(true);
        opts?.onOpen?.();
    }

    function close() {
        setIsOpen(false);
        opts?.onClose?.();
    }

    useEffect(() => {
        const handleClose = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                close();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClose);
            return () => document.removeEventListener('mousedown', handleClose);
        }
    }, [isOpen]);

    return { isOpen, open, close, containerRef } as const;
}
