import type { ItemType } from "../types/Item.type";

export async function fetchItems() {
  const response = await fetch('/api/mock');
  if (!response.ok) {
    throw new Error('Failed to fetch items. Check if backend is running.');
  }
  const data: ItemType[] = await response.json();

  return data;
}

export async function addItem(item: { name: string }) {
  const response = await fetch('/api/mock', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Failed to add item. Check if backend is running.');
  }

  const data: ItemType = await response.json();
  return data;
}

export async function deleteItem(id: number) {
  const response = await fetch(`/api/mock/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete item. Check if backend is running.');
  }

  const data: ItemType = await response.json();
  return data;
}

export async function updateItem(item: ItemType) {
  const response = await fetch(`/api/mock/${item.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Failed to update item. Check if backend is running.');
  }

  const data: ItemType = await response.json();
  return data;
}