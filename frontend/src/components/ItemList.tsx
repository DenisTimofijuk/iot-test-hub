import { useEffect, useContext } from 'react';
import { fetchItems } from '../util/fetchItems';
import { ItemContext } from './ItemContext';
import { Item } from './Item';
import useRequestHandler from '../hooks/useRequestHandler';
import type { ItemType } from '../types/Item.type';


export function ItemList() {
  const itemCtx = useContext(ItemContext);
  const { isLoading, error, executeRequest } = useRequestHandler<ItemType[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await executeRequest(fetchItems);
      if (result) {
        itemCtx.setItems(result);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Items List</h2>
      {itemCtx.items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {itemCtx.items.map((item) => (
            <Item key={item.id} data={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;