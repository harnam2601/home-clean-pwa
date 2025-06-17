// Item model
import { db } from '../db.js';

const STORE_NAME = 'items';

// Create a new item
export async function create(item) {
  return await db.add(STORE_NAME, item);
}

// Get an item by ID
export async function getById(id) {
  return await db.get(STORE_NAME, parseInt(id));
}

// Get all items
export async function getAll() {
  return await db.getAll(STORE_NAME);
}

// Get items by area ID
export async function getByAreaId(areaId) {
  return await db.getByIndex(STORE_NAME, 'areaId', parseInt(areaId));
}

// Update an item
export async function update(item) {
  return await db.put(STORE_NAME, item);
}

// Delete an item
export async function remove(id) {
  // First delete all item parts
  const itemParts = await getItemParts(id);
  
  const tx = await db.transaction(['items', 'itemParts'], 'readwrite');
  
  for (const part of itemParts) {
    await tx.objectStore('itemParts').delete(part.id);
  }
  
  // Then delete the item
  await tx.objectStore('items').delete(parseInt(id));
  
  return await tx.done;
}

// Get item parts by item ID
export async function getItemParts(itemId) {
  return await db.getByIndex('itemParts', 'itemId', parseInt(itemId));
}

// Get area by ID
export async function getArea(areaId) {
  return await db.get('areas', parseInt(areaId));
}

// Get all areas
export async function getAllAreas() {
  return await db.getAll('areas');
}

