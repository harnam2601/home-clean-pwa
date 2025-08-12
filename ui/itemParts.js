import { html, useState, useEffect } from 'https://esm.sh/htm/preact/standalone';
import { route } from 'https://esm.sh/preact-router';
import * as ItemPartModel from '../models/itemPart.js';
import { calculateStatus } from '../db.js';

export function ItemPartDetail({ id }) {
  const [part, setPart] = useState(null);
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    ItemPartModel.getById(parseInt(id)).then(async p => {
      if (p) {
        setPart(p);
        const it = await ItemPartModel.getItem(p.itemId);
        setItem(it);
        setStatus(calculateStatus(p.freqDays, p.lastDoneAt));
      }
    });
  }, [id]);
  if (!part) return html`<div class="error">Item Part not found</div>`;
  const markDone = async () => {
    try {
      await ItemPartModel.markDone(part.id);
      const updated = await ItemPartModel.getById(part.id);
      setPart(updated);
      setStatus(calculateStatus(updated.freqDays, updated.lastDoneAt));
    } catch (err) {
      alert('Error marking item part as done: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>${part.name} <small>(${item ? item.name : 'Unknown'})</small></h2>
      <div class="status-banner status-${status}">
        <div class="status-text">${status.toUpperCase()}</div>
        <div class="status ${status}"></div>
      </div>
      <div class="actions">
        <button class="btn-primary" onClick=${markDone}>Mark Done</button>
        <button class="btn-secondary" onClick=${() => route('/item-parts/' + part.id + '/edit')}>Edit</button>
      </div>
    </div>
  `;
}

export function ItemPartCreate() {
  const [name, setName] = useState('');
  const [itemId, setItemId] = useState('');
  const [freqDays, setFreqDays] = useState('');
  const [items, setItems] = useState([]);
  useEffect(() => { ItemPartModel.getAllItems().then(setItems); }, []);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !itemId || !freqDays) return alert('Please fill out all fields');
    try {
      const id = await ItemPartModel.create({ name, itemId: parseInt(itemId), freqDays: parseInt(freqDays) });
      route('/item-parts/' + id);
    } catch (err) {
      alert('Error creating item part: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>New Item Part</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="itemId">Item</label>
          <select id="itemId" name="itemId" value=${itemId} onInput=${e => setItemId(e.target.value)} required>
            <option value="">Select</option>
            ${items.map(i => html`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
        <div class="form-group">
          <label for="freqDays">Frequency (days)</label>
          <input id="freqDays" name="freqDays" type="number" min="1" value=${freqDays} onInput=${e => setFreqDays(e.target.value)} required />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/items')}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
}

export function ItemPartEdit({ id }) {
  const [name, setName] = useState('');
  const [itemId, setItemId] = useState('');
  const [freqDays, setFreqDays] = useState('');
  const [lastDoneAt, setLastDoneAt] = useState('');
  const [items, setItems] = useState([]);
  useEffect(() => {
    ItemPartModel.getById(parseInt(id)).then(p => {
      if (p) {
        setName(p.name);
        setItemId(String(p.itemId));
        setFreqDays(String(p.freqDays));
        setLastDoneAt(p.lastDoneAt ? p.lastDoneAt.substring(0,10) : '');
      }
    });
    ItemPartModel.getAllItems().then(setItems);
  }, [id]);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim() || !itemId || !freqDays) return alert('Please fill out all fields');
    try {
      await ItemPartModel.update({ id: parseInt(id), name, itemId: parseInt(itemId), freqDays: parseInt(freqDays), lastDoneAt: lastDoneAt ? new Date(lastDoneAt).toISOString() : null });
      route('/item-parts/' + id);
    } catch (err) {
      alert('Error updating item part: ' + err.message);
    }
  };
  const remove = async () => {
    if (!confirm('Are you sure you want to delete this item part?')) return;
    try {
      await ItemPartModel.remove(parseInt(id));
      route('/items/' + itemId);
    } catch (err) {
      alert('Error deleting item part: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>Edit Item Part</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="itemId">Item</label>
          <select id="itemId" name="itemId" value=${itemId} onInput=${e => setItemId(e.target.value)} required>
            ${items.map(i => html`<option value=${i.id} selected=${String(i.id)===itemId}>${i.name}</option>`)}
          </select>
        </div>
        <div class="form-group">
          <label for="freqDays">Frequency (days)</label>
          <input id="freqDays" name="freqDays" type="number" min="1" value=${freqDays} onInput=${e => setFreqDays(e.target.value)} required />
        </div>
        <div class="form-group">
          <label for="lastDoneAt">Last Done</label>
          <input id="lastDoneAt" name="lastDoneAt" type="date" value=${lastDoneAt} onInput=${e => setLastDoneAt(e.target.value)} />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/item-parts/' + id)}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" onClick=${remove}>Delete</button>
        </div>
      </form>
    </div>
  `;
}
