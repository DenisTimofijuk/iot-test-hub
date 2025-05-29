import { useContext } from "react";
import { ItemContext } from "./ItemContext";
import type { ItemType } from "../types/Item.type";
import { deleteItem, updateItem } from "../util/fetchItems";
import useRequestHandler from "../hooks/useRequestHandler";

export function Item({ data }: { data: ItemType }) {
    const itemCtx = useContext(ItemContext);

    const { executeRequest: executeDelete, isLoading: isDeleteLoading } = useRequestHandler<ItemType>();
    const { executeRequest: executeUpdate, isLoading: isEditLoading } = useRequestHandler<ItemType>();

    async function handleDelete() {
        const result = await executeDelete(() => deleteItem(data.id));

        if (!result) {
            alert('Failed to delete item. Check if backend is running.');
            return;
        }

        itemCtx.setItems((prevItems: ItemType[]) => prevItems.filter(item => item.id !== data.id));
    }

    async function handleEdit() {
        const newName = prompt("Enter new name:", data.name);
        if (newName) {
            const result = await executeUpdate(() => updateItem({ ...data, name: newName }));

            if (!result) {
                alert('Failed to update item. Check if backend is running.');
                return;
            }

            itemCtx.setItems((prevItems: ItemType[]) =>
                prevItems.map(item => item.id === data.id ? { ...item, name: newName } : item)
            );
        }
    }

    return (
        <div className="item">
            <div>{data.name}</div>
            <button
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleteLoading}
            >
                {isDeleteLoading ? "Deleting..." : "Delete"}
            </button>
            <button
                className="edit-button"
                onClick={handleEdit}
                disabled={isEditLoading}
            >
                {isEditLoading ? "Updating..." : "Edit"}
            </button>
        </div>
    );
}