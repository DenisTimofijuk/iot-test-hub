import { useEffect, useContext } from 'react';
import { fetchDataFromDB } from '../util/fetchItems';
import { ItemContext } from './ItemContext';
import { Item } from './Item';
import useRequestHandler from '../hooks/useRequestHandler';
import type { FetchedDataType, Reading } from '../types/ReadingsData';


export function ItemList() {
  const itemCtx = useContext(ItemContext);
  const { isLoading, error, executeRequest } = useRequestHandler<Reading[]>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await executeRequest(async () => {
        const r = await fetchDataFromDB<FetchedDataType>('/api/devices/readings?limit=0');
        return r.data;
      });
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
      {itemCtx.data.length === 0 ? (
        <p>No items found</p>
      ) : (
        <ul>
          {itemCtx.data.map((item) => (
            <Item key={item.timestamp} data={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemList;