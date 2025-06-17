// Items UI component
import * as ItemModel from '../models/item.js';
import { calculateStatus } from '../db.js';
import router from './app.js';

// List view
export async function listView() {
  const items = await ItemModel.getAll();
  const areas = await ItemModel.getAllAreas();
  
  // Create a map of area IDs to names for quick lookup
  const areaMap = {};
  areas.forEach(area => {
    areaMap[area.id] = area.name;
  });
  
  // Get all item parts for status calculation
  for (const item of items) {
    const parts = await ItemModel.getItemParts(item.id);
    
    // Calculate worst status for each item
    if (parts.length > 0) {
      const statuses = parts.map(part => calculateStatus(part.freqDays, part.lastDoneAt));
      
      if (statuses.includes('red')) {
        item.status = 'red';
      } else if (statuses.includes('yellow')) {
        item.status = 'yellow';
      } else {
        item.status = 'green';
      }
    } else {
      item.status = 'none';
    }
  }
  
  // Sort items by status (red, yellow, green, none)
  const statusOrder = { red: 0, yellow: 1, green: 2, none: 3 };
  items.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  
  let html = `
    <div class="card">
      <h2>Items</h2>
      <div class="list">
  `;
  
  if (items.length === 0) {
    html += `<p class="empty-list">No items found. Add your first one!</p>`;
  } else {
    items.forEach(item => {
      const areaName = areaMap[item.areaId] || 'Unknown';
      const statusClass = item.status ? `status-${item.status}` : '';
      const statusDot = item.status ? `<span class="status ${statusClass}"></span>` : '';
      
      html += `
        <div class="list-item" data-id="${item.id}" onclick="window.location.hash = '/items/${item.id}'">
          <span>${item.name} <small>(${areaName})</small></span>
          ${statusDot}
        </div>
      `;
    });
  }
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Detail view
export async function detailView(id) {
  const item = await ItemModel.getById(parseInt(id));
  
  if (!item) {
    return `<div class="error">Item not found</div>`;
  }
  
  const area = await ItemModel.getArea(item.areaId);
  const itemParts = await ItemModel.getItemParts(item.id);
  
  // Calculate status for each item part
  itemParts.forEach(part => {
    part.status = calculateStatus(part.freqDays, part.lastDoneAt);
    
    // Calculate days since last done
    if (part.lastDoneAt) {
      const now = new Date();
      const lastDone = new Date(part.lastDoneAt);
      part.daysSince = Math.floor((now - lastDone) / (1000 * 60 * 60 * 24));
    } else {
      part.daysSince = null;
    }
  });
  
  // Sort item parts by status (red, yellow, green)
  const statusOrder = { red: 0, yellow: 1, green: 2 };
  itemParts.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  
  let html = `
    <div class="card">
      <h2>${item.name} <small>(${area ? area.name : 'Unknown'})</small></h2>
      <div class="actions">
        <button class="btn-secondary" onclick="window.location.hash = '/items/${item.id}/edit'">Edit</button>
      </div>
    </div>
    
    <div class="card">
      <h3>Parts</h3>
      <div class="list">
  `;
  
  if (itemParts.length === 0) {
    html += `<p class="empty-list">No parts for this item yet.</p>`;
  } else {
    itemParts.forEach(part => {
      const statusClass = `status-${part.status}`;
      const lastDoneText = part.lastDoneAt 
        ? `${part.daysSince} days ago (${new Date(part.lastDoneAt).toLocaleDateString()})`
        : 'Never';
      
      html += `
        <div class="list-item" data-id="${part.id}" onclick="window.location.hash = '/item-parts/${part.id}'">
          <div>
            <div>${part.name}</div>
            <div class="item-part-details">
              <small>Every ${part.freqDays} days | Last done: ${lastDoneText}</small>
            </div>
          </div>
          <span class="status ${statusClass}"></span>
        </div>
      `;
    });
  }
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}

// Create view
export async function createView() {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const preselectedAreaId = urlParams.get('areaId');
  
  const areas = await ItemModel.getAllAreas();
  
  let html = `
    <div class="card">
      <h2>New Item</h2>
      <form id="item-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="areaId">Area</label>
          <select id="areaId" name="areaId" required>
            <option value="">Select Area</option>
  `;
  
  areas.forEach(area => {
    const selected = preselectedAreaId && parseInt(preselectedAreaId) === area.id ? 'selected' : '';
    html += `<option value="${area.id}" ${selected}>${area.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/items'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('item-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const areaIdInput = document.getElementById('areaId');
        
        const name = nameInput.value.trim();
        const areaId = parseInt(areaIdInput.value);
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!areaId) {
          alert('Please select an area');
          return;
        }
        
        try {
          const item = { name, areaId };
          const id = await import('../models/item.js').then(module => module.create(item));
          
          // If we came from an area detail view, go back there
          const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
          const fromArea = urlParams.get('areaId');
          
          if (fromArea) {
            window.location.hash = '/areas/' + fromArea;
          } else {
            window.location.hash = '/items';
          }
        } catch (error) {
          console.error('Error creating item:', error);
          alert('Error creating item: ' + error.message);
        }
      });
    </script>
  `;
  
  return html;
}

// Edit view
export async function editView(id) {
  const item = await ItemModel.getById(parseInt(id));
  
  if (!item) {
    return `<div class="error">Item not found</div>`;
  }
  
  const areas = await ItemModel.getAllAreas();
  
  let html = `
    <div class="card">
      <h2>Edit Item</h2>
      <form id="item-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value="${item.name}" required>
        </div>
        <div class="form-group">
          <label for="areaId">Area</label>
          <select id="areaId" name="areaId" required>
  `;
  
  areas.forEach(area => {
    const selected = item.areaId === area.id ? 'selected' : '';
    html += `<option value="${area.id}" ${selected}>${area.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/items/${item.id}'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" id="delete-btn">Delete</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('item-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const areaIdInput = document.getElementById('areaId');
        
        const name = nameInput.value.trim();
        const areaId = parseInt(areaIdInput.value);
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!areaId) {
          alert('Please select an area');
          return;
        }
        
        try {
          const item = { id: ${item.id}, name, areaId };
          await import('../models/item.js').then(module => module.update(item));
          window.location.hash = '/items';
        } catch (error) {
          console.error('Error updating item:', error);
          alert('Error updating item: ' + error.message);
        }
      });
      
      document.getElementById('delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this item? This will also delete all associated parts.')) {
          try {
            await import('../models/item.js').then(module => module.remove(${item.id}));
            window.location.hash = '/items';
          } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item: ' + error.message);
          }
        }
      });
    </script>
  `;
  
  return html;
}

