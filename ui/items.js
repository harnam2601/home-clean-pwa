import { html, useState, useEffect } from 'https://esm.sh/htm/preact/standalone';
import { route } from 'https://esm.sh/preact-router';
import * as ItemModel from '../models/item.js';

export function ItemList() {
  const [items, setItems] = useState([]);
  const [areaMap, setAreaMap] = useState({});
  useEffect(() => {
    Promise.all([ItemModel.getAll(), ItemModel.getAllAreas()]).then(([i, areas]) => {
      const map = {};
      areas.forEach(a => { map[a.id] = a.name; });
      setItems(i);
      setAreaMap(map);
    });
  }, []);
  return html`
    <div class="card">
      <h2>Items</h2>
      <div class="list">
        ${items.length === 0
          ? html`<p class="empty-list">No items found. Add your first one!</p>`
          : items.map(it => html`
              <div class="list-item" data-id=${it.id} onClick=${() => route('/items/' + it.id)}>
                <span>${it.name} <small>(${areaMap[it.areaId] || 'Unknown'})</small></span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
    </div>
  `;
}

export function ItemDetail({ id }) {
  const [item, setItem] = useState(null);
  const [area, setArea] = useState(null);
  const [parts, setParts] = useState([]);
  useEffect(() => {
    ItemModel.getById(parseInt(id)).then(it => {
      if (it) {
        setItem(it);
        ItemModel.getArea(it.areaId).then(setArea);
        ItemModel.getItemParts(it.id).then(setParts);
      }
    });
  }, [id]);
  if (!item) return html`<div class="error">Item not found</div>`;
  return html`
    <div class="card">
      <h2>${item.name} ${area ? html`<small>(${area.name})</small>` : ''}</h2>
      <div class="actions">
        <button class="btn-secondary" onClick=${() => route('/items/' + item.id + '/edit')}>Edit</button>
      </div>
    </div>
    <div class="card">
      <h3>Parts</h3>
      <div class="list">
        ${parts.length === 0
          ? html`<p class="empty-list">No parts for this item yet.</p>`
          : parts.map(p => html`
              <div class="list-item" data-id=${p.id} onClick=${() => route('/item-parts/' + p.id)}>
                <span>${p.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
      <div class="actions">
        <button class="btn-primary" onClick=${() => route('/item-parts/new?itemId=' + item.id)}>Add Part</button>
      </div>
    </div>
  `;
}

export function ItemCreate() {
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState([]);
  useEffect(() => { ItemModel.getAllAreas().then(setAreas); }, []);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !areaId) return alert('Please fill out all fields');
    try {
      const id = await ItemModel.create({ name, areaId: parseInt(areaId) });
      route('/items/' + id);
    } catch (err) {
      alert('Error creating item: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>New Item</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="areaId">Area</label>
          <select id="areaId" name="areaId" value=${areaId} onInput=${e => setAreaId(e.target.value)} required>
            <option value="">Select</option>
            ${areas.map(a => html`<option value=${a.id}>${a.name}</option>`)}
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/items')}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
}

export function ItemEdit({ id }) {
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState('');
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    ItemModel.getById(parseInt(id)).then(it => {
      if (it) {
        setName(it.name);
        setAreaId(String(it.areaId));
      }
    });
    ItemModel.getAllAreas().then(setAreas);
  }, [id]);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !areaId) return alert('Please fill out all fields');
    try {
      await ItemModel.update({ id: parseInt(id), name, areaId: parseInt(areaId) });
      route('/items');
    } catch (err) {
      alert('Error updating item: ' + err.message);
    }
  };
  const remove = async () => {
    if (!confirm('Are you sure you want to delete this item? This will also delete all associated parts.')) return;
    try {
      await ItemModel.remove(parseInt(id));
      route('/items');
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>Edit Item</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="areaId">Area</label>
          <select id="areaId" name="areaId" value=${areaId} onInput=${e => setAreaId(e.target.value)} required>
            ${areas.map(a => html`<option value=${a.id} selected=${String(a.id)===areaId}>${a.name}</option>`)}
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/items/' + id)}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" onClick=${remove}>Delete</button>
        </div>
      </form>
    </div>
  `;
}
