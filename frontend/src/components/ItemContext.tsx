import { createContext } from 'react';
import type { ItemContextType } from '../types/ItemContext.type';


export const ItemContext = createContext<ItemContextType>({
    data: [],
    setItems: () => { }
});

