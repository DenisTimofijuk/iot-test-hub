import type { ItemType } from "./Item.type";

export interface ItemContextType {
    items: ItemType[];
    setItems: (items: ItemType[] | ((prevItems: ItemType[]) => ItemType[])) => void;
}