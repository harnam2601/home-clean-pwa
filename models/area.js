// Area model
import { db } from '../db.js';

const STORE_NAME = 'areas';

// Create a new area
export async function create(area) {
  return await db.add(STORE_NAME, area);
}

// Get an area by ID
export async function getById(id) {
  return await db.get(STORE_NAME, parseInt(id));
}

// Get all areas
export async function getAll() {
  return await db.getAll(STORE_NAME);
}

// Get areas by area type ID
export async function getByAreaTypeId(areaTypeId) {
  return await db.getByIndex(STORE_NAME, 'areaTypeId', parseInt(areaTypeId));
}

// Update an area
export async function update(area) {
  return await db.put(STORE_NAME, area);
}

// Delete an area
export async function remove(id) {
  return await db.delete(STORE_NAME, parseInt(id));
}

// Get items by area ID
export async function getItems(areaId) {
  return await db.getByIndex('items', 'areaId', parseInt(areaId));
}

// Get area type by ID
export async function getAreaType(areaTypeId) {
  return await db.get('areaTypes', parseInt(areaTypeId));
}

// Get all area types
export async function getAllAreaTypes() {
  return await db.getAll('areaTypes');
}

