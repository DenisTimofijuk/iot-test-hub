import { useState } from 'react';

type ModalFormProps = {
    dialogRef: React.RefObject<HTMLDialogElement | null>;
    onSubmit: (data: { name: string }) => void;
};

export default function ModalForm({dialogRef, onSubmit }: ModalFormProps) {
    const [name, setName] = useState('');

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
    };

    const resetForm = () => {
        setName('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name });

        closeModal();
    };

    return (
        <dialog ref={dialogRef} onClose={resetForm}>
            <h2>Add new item</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Add</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </dialog>
    );
}
