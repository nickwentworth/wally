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

    const [draftState, setDraftState] = useState(props.value);
    const draftRef = useRef(draftState);

    const editRef = useRef<HTMLDivElement>(null);

    // This must be used instead of the raw state setter so committing works as expected
    const setDraft = (v: T) => {
        draftRef.current = v;
        setDraftState(v);
    };

    useEffect(() => {
        if (isEditing) {
            // Reset draft when we start editing again
            setDraft(props.value);

            // And try to focus the first focus-able element
            const el =
                editRef.current?.querySelector<HTMLElement>(
                    'input,select,textarea',
                ) ?? editRef.current?.querySelector<HTMLElement>('button');

            el?.focus();
            // Also select inputs for easier editing
            if (el instanceof HTMLInputElement) {
                el.select();
            }
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
                        if (draftRef.current !== props.value) {
                            props.onCommit(draftRef.current);
                        }
                    }
                }}
                onKeyDown={(e) => {
                    // Cancel commit, back to the initial provided value
                    if (e.key.toUpperCase() === 'ESCAPE') {
                        setDraft(props.value);
                        setIsEditing(false);
                    }
                }}
            >
                {props.input(draftState, setDraft)}
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
