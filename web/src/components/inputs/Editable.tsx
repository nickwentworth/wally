import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

type Setter<T> = (value: T) => void;

type EditableProps<T> = {
    value: T;
    onCommit: (value: T) => void;
    display: (value: T) => React.ReactNode;
    input: (value: T, setValue: Setter<T>) => React.ReactNode;
};

/**
 * Represents a single component that has a different state while it is being edited.
 *
 * After the user exits the input naturally, either by clicking out or tabbing through,
 * the changes are committed (via `onCommit`).
 *
 * If the user instead presses "Escape", the changes are scrapped and editing stops.
 */
export function Editable<T>(props: EditableProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(props.value);

    const editRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isEditing) {
            // Reset draft when we start editing again
            setDraft(props.value);

            // And try to focus the first focus-able element
            editRef.current
                ?.querySelector<HTMLElement>('input,select,textarea,button')
                ?.focus();
        }
    }, [isEditing]);

    if (isEditing) {
        return (
            <div
                ref={editRef}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        // When moving out of this element
                        setIsEditing(false);
                        if (draft !== props.value) {
                            console.log('Committing to ' + draft);
                            props.onCommit(draft);
                        }
                    }
                }}
                onKeyDown={(e) => {
                    // Escape will act as the key to cancel committing the draft value
                    if (e.key.toUpperCase() === 'ESCAPE') {
                        console.log('Cancelling edit');
                        setDraft(props.value);
                        setIsEditing(false);
                    }
                }}
            >
                {props.input(draft, setDraft)}
            </div>
        );
    } else {
        return (
            <div
                onFocus={() => setIsEditing(true)}
                onClick={() => setIsEditing(true)}
                tabIndex={0}
            >
                {props.display(props.value)}
            </div>
        );
    }
}
