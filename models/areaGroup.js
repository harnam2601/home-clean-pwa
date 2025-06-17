// Area Group model
import { db } from '../db.js';

const STORE_NAME = 'areaGroups';
const JOIN_STORE = 'areaGroupAreas';

// Create a new area group
export async function create(areaGroup) {
  return await db.add(STORE_NAME, areaGroup);
}

// Get an area group by ID
export async function getById(id) {
  return await db.get(STORE_NAME, parseInt(id));
}

// Get all area groups
export async function getAll() {
  return await db.getAll(STORE_NAME);
}

// Update an area group
export async function update(areaGroup) {
  return await db.put(STORE_NAME, areaGroup);
}

// Delete an area group
export async function remove(id) {
  const tx = await db.transaction([STORE_NAME, JOIN_STORE], 'readwrite');
  
  // Delete all join records for this group
  const joinStore = tx.objectStore(JOIN_STORE);
  const joinRecords = await joinStore.index('groupId').getAll(parseInt(id));
  
  for (const record of joinRecords) {
    await joinStore.delete([record.groupId, record.areaId]);
  }
  
  // Delete the group itself
  await tx.objectStore(STORE_NAME).delete(parseInt(id));
  
  return await tx.done;
}

// Add area to group
export async function addArea(groupId, areaId) {
  return await db.add(JOIN_STORE, { groupId: parseInt(groupId), areaId: parseInt(areaId) });
}

// Remove area from group
export async function removeArea(groupId, areaId) {
  return await db.delete(JOIN_STORE, [parseInt(groupId), parseInt(areaId)]);
}

// Get areas in a group
export async function getAreas(groupId) {
  const joinRecords = await db.getByIndex(JOIN_STORE, 'groupId', parseInt(groupId));
  
  if (!joinRecords.length) {
    return [];
  }
  
  const areaIds = joinRecords.map(record => record.areaId);
  const areas = [];
  
  for (const areaId of areaIds) {
    const area = await db.get('areas', areaId);
    if (area) {
      areas.push(area);
    }
  }
  
  return areas;
}

// Get all areas not in a group
export async function getAreasNotInGroup(groupId) {
  const allAreas = await db.getAll('areas');
  const groupAreas = await getAreas(groupId);
  const groupAreaIds = groupAreas.map(area => area.id);
  
  return allAreas.filter(area => !groupAreaIds.includes(area.id));
}

