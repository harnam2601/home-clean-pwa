import { signal } from 'https://esm.sh/@preact/signals@latest?deps=preact@10';
import * as AreaTypeModel from '../models/areaType.js';

// Signals
export const areaTypes = signal([]);

// Actions
export async function loadAreaTypes() {
  areaTypes.value = await AreaTypeModel.getAll();
}

export async function createAreaType(areaType) {
  const id = await AreaTypeModel.create(areaType);
  areaTypes.value = [...areaTypes.value, { id, ...areaType }];
  return id;
}

export async function updateAreaType(areaType) {
  await AreaTypeModel.update(areaType);
  areaTypes.value = areaTypes.value.map(at => at.id === areaType.id ? areaType : at);
}

export async function removeAreaType(id) {
  await AreaTypeModel.remove(id);
  areaTypes.value = areaTypes.value.filter(at => at.id !== id);
}
