// Item Part model
import { db } from '../db.js';

const STORE_NAME = 'itemParts';

// Create a new item part
export async function create(itemPart) {
  return await db.add(STORE_NAME, itemPart);
}

// Get an item part by ID
export async function getById(id) {
  return await db.get(STORE_NAME, parseInt(id));
}

// Get all item parts
export async function getAll() {
  return await db.getAll(STORE_NAME);
}

// Get item parts by item ID
export async function getByItemId(itemId) {
  return await db.getByIndex(STORE_NAME, 'itemId', parseInt(itemId));
}

// Update an item part
export async function update(itemPart) {
  return await db.put(STORE_NAME, itemPart);
}

// Delete an item part
export async function remove(id) {
  return await db.delete(STORE_NAME, parseInt(id));
}

// Mark an item part as done
export async function markDone(id) {
  const itemPart = await getById(id);
  
  if (!itemPart) {
    throw new Error('Item part not found');
  }
  
  itemPart.lastDoneAt = new Date().toISOString();
  
  return await update(itemPart);
}

// Get item by ID
export async function getItem(itemId) {
  return await db.get('items', parseInt(itemId));
}

// Get all items
export async function getAllItems() {
  return await db.getAll('items');
}

