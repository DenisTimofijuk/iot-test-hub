import type { Reading } from "./ReadingsData";

export interface ItemContextType {
    data: Reading[];
    setItems: (items: Reading[] | ((prevItems: Reading[]) => Reading[])) => void;
}