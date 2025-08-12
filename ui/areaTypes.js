import { html, useState, useEffect } from 'https://esm.sh/htm/preact/standalone';
import { route } from 'https://esm.sh/preact-router';
import * as AreaTypeModel from '../models/areaType.js';

export function AreaTypeList() {
  const [types, setTypes] = useState([]);
  useEffect(() => { AreaTypeModel.getAll().then(setTypes); }, []);
  return html`
    <div class="card">
      <h2>Area Types</h2>
      <div class="list">
        ${types.length === 0
          ? html`<p class="empty-list">No area types found. Add your first one!</p>`
          : types.map(t => html`
              <div class="list-item" data-id=${t.id} onClick=${() => route('/area-types/' + t.id)}>
                <span>${t.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
    </div>
  `;
}

export function AreaTypeDetail({ id }) {
  const [areaType, setAreaType] = useState(null);
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    AreaTypeModel.getById(parseInt(id)).then(setAreaType);
    AreaTypeModel.getAreas(parseInt(id)).then(setAreas);
  }, [id]);
  if (!areaType) return html`<div class="error">Area Type not found</div>`;
  return html`
    <div class="card">
      <h2>${areaType.name}</h2>
      <div class="actions">
        <button class="btn-secondary" onClick=${() => route('/area-types/' + areaType.id + '/edit')}>Edit</button>
      </div>
    </div>
    <div class="card">
      <h3>Areas</h3>
      <div class="list">
        ${areas.length === 0
          ? html`<p class="empty-list">No areas in this category yet.</p>`
          : areas.map(a => html`
              <div class="list-item" data-id=${a.id} onClick=${() => route('/areas/' + a.id)}>
                <span>${a.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
      <div class="actions">
        <button class="btn-primary" onClick=${() => route('/areas/new?areaTypeId=' + areaType.id)}>Add Area</button>
      </div>
    </div>
  `;
}

export function AreaTypeCreate() {
  const [name, setName] = useState('');
  const submit = async e => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a name');
    try {
      await AreaTypeModel.create({ name });
      route('/area-types');
    } catch (err) {
      alert('Error creating area type: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>New Area Type</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/area-types')}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
}

export function AreaTypeEdit({ id }) {
  const [name, setName] = useState('');
  useEffect(() => {
    AreaTypeModel.getById(parseInt(id)).then(at => at && setName(at.name));
  }, [id]);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a name');
    try {
      await AreaTypeModel.update({ id: parseInt(id), name });
      route('/area-types');
    } catch (err) {
      alert('Error updating area type: ' + err.message);
    }
  };
  const remove = async () => {
    if (!confirm('Are you sure you want to delete this area type? This will also delete all associated areas.')) return;
    try {
      await AreaTypeModel.remove(parseInt(id));
      route('/area-types');
    } catch (err) {
      alert('Error deleting area type: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>Edit Area Type</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/area-types/' + id)}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" onClick=${remove}>Delete</button>
        </div>
      </form>
    </div>
  `;
}
