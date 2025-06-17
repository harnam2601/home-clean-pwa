// Area Type model
import { db } from '../db.js';

const STORE_NAME = 'areaTypes';

// Create a new area type
export async function create(areaType) {
  return await db.add(STORE_NAME, areaType);
}

// Get an area type by ID
export async function getById(id) {
  return await db.get(STORE_NAME, parseInt(id));
}

// Get all area types
export async function getAll() {
  return await db.getAll(STORE_NAME);
}

// Update an area type
export async function update(areaType) {
  return await db.put(STORE_NAME, areaType);
}

// Delete an area type
export async function remove(id) {
  return await db.delete(STORE_NAME, parseInt(id));
}

// Get areas by area type ID
export async function getAreas(areaTypeId) {
  return await db.getByIndex('areas', 'areaTypeId', parseInt(areaTypeId));
}

