import { html, useState, useEffect } from 'https://esm.sh/htm/preact/standalone';
import { route } from 'https://esm.sh/preact-router';
import { useComputed } from 'https://esm.sh/@preact/signals@latest?deps=preact@10';
import { areaTypes, loadAreaTypes } from '../state/store.js';
import * as AreaModel from '../models/area.js';

export function AreaList() {
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    AreaModel.getAll().then(setAreas);
    loadAreaTypes();
  }, []);
  const typeMap = useComputed(() => {
    const map = {};
    areaTypes.value.forEach(at => { map[at.id] = at.name; });
    return map;
  });
  return html`
    <div class="card">
      <h2>Areas</h2>
      <div class="list">
        ${areas.length === 0
          ? html`<p class="empty-list">No areas found. Add your first one!</p>`
          : areas.map(a => html`
              <div class="list-item" data-id=${a.id} onClick=${() => route('/areas/' + a.id)}>
                <span>${a.name} <small>(${typeMap.value[a.areaTypeId] || 'Unknown'})</small></span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
    </div>
  `;
}

export function AreaDetail({ id }) {
  const [area, setArea] = useState(null);
  const [areaType, setAreaType] = useState(null);
  const [items, setItems] = useState([]);
  useEffect(() => {
    AreaModel.getById(parseInt(id)).then(a => {
      if (a) {
        setArea(a);
        AreaModel.getAreaType(a.areaTypeId).then(setAreaType);
        AreaModel.getItems(a.id).then(setItems);
      }
    });
  }, [id]);
  if (!area) return html`<div class="error">Area not found</div>`;
  return html`
    <div class="card">
      <h2>${area.name} ${areaType ? html`<small>(${areaType.name})</small>` : ''}</h2>
      <div class="actions">
        <button class="btn-secondary" onClick=${() => route('/areas/' + area.id + '/edit')}>Edit</button>
      </div>
    </div>
    <div class="card">
      <h3>Items</h3>
      <div class="list">
        ${items.length === 0
          ? html`<p class="empty-list">No items in this area yet.</p>`
          : items.map(i => html`
              <div class="list-item" data-id=${i.id} onClick=${() => route('/items/' + i.id)}>
                <span>${i.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
      <div class="actions">
        <button class="btn-primary" onClick=${() => route('/items/new?areaId=' + area.id)}>Add Item</button>
      </div>
    </div>
  `;
}

export function AreaCreate() {
  const [name, setName] = useState('');
  const [areaTypeId, setAreaTypeId] = useState('');
  useEffect(() => { loadAreaTypes(); }, []);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !areaTypeId) return alert('Please fill out all fields');
    try {
      await AreaModel.create({ name, areaTypeId: parseInt(areaTypeId) });
      route('/areas');
    } catch (err) {
      alert('Error creating area: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>New Area</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="areaTypeId">Area Type</label>
          <select id="areaTypeId" name="areaTypeId" value=${areaTypeId} onInput=${e => setAreaTypeId(e.target.value)} required>
            <option value="">Select</option>
            ${areaTypes.value.map(t => html`<option value=${t.id}>${t.name}</option>`)}
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/areas')}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
}

export function AreaEdit({ id }) {
  const [name, setName] = useState('');
  const [areaTypeId, setAreaTypeId] = useState('');
  useEffect(() => {
    AreaModel.getById(parseInt(id)).then(a => {
      if (a) {
        setName(a.name);
        setAreaTypeId(String(a.areaTypeId));
      }
    });
    loadAreaTypes();
  }, [id]);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !areaTypeId) return alert('Please fill out all fields');
    try {
      await AreaModel.update({ id: parseInt(id), name, areaTypeId: parseInt(areaTypeId) });
      route('/areas');
    } catch (err) {
      alert('Error updating area: ' + err.message);
    }
  };
  const remove = async () => {
    if (!confirm('Are you sure you want to delete this area?')) return;
    try {
      await AreaModel.remove(parseInt(id));
      route('/areas');
    } catch (err) {
      alert('Error deleting area: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>Edit Area</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="areaTypeId">Area Type</label>
          <select id="areaTypeId" name="areaTypeId" value=${areaTypeId} onInput=${e => setAreaTypeId(e.target.value)} required>
            ${areaTypes.value.map(t => html`<option value=${t.id} selected=${String(t.id)===areaTypeId}>${t.name}</option>`)}
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/areas/' + id)}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" onClick=${remove}>Delete</button>
        </div>
      </form>
    </div>
  `;
}
