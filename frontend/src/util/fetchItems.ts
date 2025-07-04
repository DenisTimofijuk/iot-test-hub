import { getTokenFromLocalStor } from "./auth";

export async function fetchDataFromDB<T>(url: string) {
  const token = getTokenFromLocalStor();
  const response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + token.token
    }
  });
  
  const data: T = await response.json();

  if (!response.ok) {
    throw {
            message: (data as any).message || 'Failed to fetch items. Check if backend is running.',
            status: response.status || 500,
        };
  }

  return data;
}

// export async function addItem(item: { name: string }) {
//   const response = await fetch(END_POINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(item),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to add item. Check if backend is running.');
//   }

//   const data: Reading = await response.json();
//   return data;
// }

// export async function deleteItem(id: number) {
//   const response = await fetch(`${END_POINT}/${id}`, {
//     method: 'DELETE',
//   });

//   if (!response.ok) {
//     throw new Error('Failed to delete item. Check if backend is running.');
//   }

//   const data: ItemType = await response.json();
//   return data;
// }

// export async function updateItem(item: ItemType) {
//   const response = await fetch(`${END_POINT}/${item.id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(item),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to update item. Check if backend is running.');
//   }

//   const data: ItemType = await response.json();
//   return data;
// }