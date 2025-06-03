import { useEffect, useRef, useState } from 'react';
import './css/App.css';
import ItemList from './components/ItemList';
import { ItemContext } from './components/ItemContext';
import type { ItemContextType } from './types/ItemContext.type';
import type { Reading } from './types/ReadingsData';
import { TemperatureChart } from './components/Chart';
import ConnectionStatus from './components/ConnectionStatus';

function App() {
  const [items, setItems] = useState<Reading[]>([]);

  // const { isLoading, error, executeRequest } = useRequestHandler<Reading>();

  // async function handleAddItem(newItem: { name: string; }) {
  //   const item = { name: newItem.name };
  //   const result = await executeRequest(() => addItem(item));

  //   if (!result) {
  //     return;
  //   }

  //   setItems((prevItems) => [...prevItems, result]);
  // }

  const ctxValue: ItemContextType = {
    data: items,
    setItems
  }
  return (
    <>
      <h1>This is a monorepo template</h1>
      <p>It contains a frontend and a backend</p>
      <ItemContext value={ctxValue}>
        <ConnectionStatus />
        <TemperatureChart/>
        <ItemList />
        {/* {error && <div className='error'>{error}</div>} */}
        {/* <button disabled={isLoading} onClick={() => dialog.current?.showModal()}>{isLoading ? 'Adding...' : 'Add new item'}</button> */}
        {/* <ModalForm dialogRef={dialog} onSubmit={handleAddItem} /> */}
      </ItemContext>
    </>
  );
}

export default App;


/**
 * I have this working solution.
 * But I am not ahppy that I have to use useState here for items 
 * when I have context which has data which is same Items list.
 * 
 * How can we improove this code?
 * 
 */