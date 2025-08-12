import { html, useState, useEffect } from 'https://esm.sh/htm/preact/standalone';
import { route } from 'https://esm.sh/preact-router';
import * as AreaGroupModel from '../models/areaGroup.js';

export function AreaGroupList() {
  const [groups, setGroups] = useState([]);
  useEffect(() => { AreaGroupModel.getAll().then(setGroups); }, []);
  return html`
    <div class="card">
      <h2>Area Groups</h2>
      <div class="list">
        ${groups.length === 0
          ? html`<p class="empty-list">No area groups found. Add your first one!</p>`
          : groups.map(g => html`
              <div class="list-item" data-id=${g.id} onClick=${() => route('/area-groups/' + g.id)}>
                <span>${g.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
    </div>
  `;
}

export function AreaGroupDetail({ id }) {
  const [group, setGroup] = useState(null);
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    AreaGroupModel.getById(parseInt(id)).then(setGroup);
    AreaGroupModel.getAreas(parseInt(id)).then(setAreas);
  }, [id]);
  if (!group) return html`<div class="error">Area Group not found</div>`;
  return html`
    <div class="card">
      <h2>${group.name}</h2>
      <div class="actions">
        <button class="btn-secondary" onClick=${() => route('/area-groups/' + group.id + '/edit')}>Edit</button>
      </div>
    </div>
    <div class="card">
      <h3>Areas</h3>
      <div class="list">
        ${areas.length === 0
          ? html`<p class="empty-list">No areas in this group yet.</p>`
          : areas.map(a => html`
              <div class="list-item" data-id=${a.id} onClick=${() => route('/areas/' + a.id)}>
                <span>${a.name}</span>
                <span class="chevron">›</span>
              </div>`)}
      </div>
      <div class="actions">
        <button class="btn-primary" onClick=${() => route('/areas/new?areaGroupId=' + group.id)}>Add Area</button>
      </div>
    </div>
  `;
}

export function AreaGroupCreate() {
  const [name, setName] = useState('');
  const submit = async e => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a name');
    try {
      await AreaGroupModel.create({ name });
      route('/area-groups');
    } catch (err) {
      alert('Error creating area group: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>New Area Group</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/area-groups')}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
}

export function AreaGroupEdit({ id }) {
  const [name, setName] = useState('');
  useEffect(() => {
    AreaGroupModel.getById(parseInt(id)).then(g => g && setName(g.name));
  }, [id]);
  const submit = async e => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a name');
    try {
      await AreaGroupModel.update({ id: parseInt(id), name });
      route('/area-groups');
    } catch (err) {
      alert('Error updating area group: ' + err.message);
    }
  };
  const remove = async () => {
    if (!confirm('Are you sure you want to delete this area group?')) return;
    try {
      await AreaGroupModel.remove(parseInt(id));
      route('/area-groups');
    } catch (err) {
      alert('Error deleting area group: ' + err.message);
    }
  };
  return html`
    <div class="card">
      <h2>Edit Area Group</h2>
      <form onSubmit=${submit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" name="name" value=${name} onInput=${e => setName(e.target.value)} required />
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onClick=${() => route('/area-groups/' + id)}>Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" onClick=${remove}>Delete</button>
        </div>
      </form>
    </div>
  `;
}
