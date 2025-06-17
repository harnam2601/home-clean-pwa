// Areas UI component
import * as AreaModel from '../models/area.js';
import router from './app.js';

// List view
export async function listView() {
  const areas = await AreaModel.getAll();
  const areaTypes = await AreaModel.getAllAreaTypes();
  
  // Create a map of area type IDs to names for quick lookup
  const areaTypeMap = {};
  areaTypes.forEach(areaType => {
    areaTypeMap[areaType.id] = areaType.name;
  });
  
  let html = `
    <div class="card">
      <h2>Areas</h2>
      <div class="list">
  `;
  
  if (areas.length === 0) {
    html += `<p class="empty-list">No areas found. Add your first one!</p>`;
  } else {
    areas.forEach(area => {
      const areaTypeName = areaTypeMap[area.areaTypeId] || 'Unknown';
      
      html += `
        <div class="list-item" data-id="${area.id}" onclick="window.location.hash = '/areas/${area.id}'">
          <span>${area.name} <small>(${areaTypeName})</small></span>
          <span class="chevron">›</span>
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
  const area = await AreaModel.getById(parseInt(id));
  
  if (!area) {
    return `<div class="error">Area not found</div>`;
  }
  
  const areaType = await AreaModel.getAreaType(area.areaTypeId);
  const items = await AreaModel.getItems(area.id);
  
  // Get all item parts for status calculation
  const itemParts = [];
  for (const item of items) {
    const parts = await import('../models/item.js').then(module => module.getItemParts(item.id));
    item.parts = parts;
    
    // Calculate worst status for each item
    if (parts.length > 0) {
      const statuses = parts.map(part => {
        return import('../db.js').then(module => module.calculateStatus(part.freqDays, part.lastDoneAt));
      });
      
      const resolvedStatuses = await Promise.all(statuses);
      
      if (resolvedStatuses.includes('red')) {
        item.status = 'red';
      } else if (resolvedStatuses.includes('yellow')) {
        item.status = 'yellow';
      } else {
        item.status = 'green';
      }
    } else {
      item.status = 'none';
    }
  }
  
  let html = `
    <div class="card">
      <h2>${area.name} <small>(${areaType ? areaType.name : 'Unknown'})</small></h2>
      <div class="actions">
        <button class="btn-secondary" onclick="window.location.hash = '/areas/${area.id}/edit'">Edit</button>
      </div>
    </div>
    
    <div class="card">
      <h3>Items</h3>
      <div class="list">
  `;
  
  if (items.length === 0) {
    html += `<p class="empty-list">No items in this area yet.</p>`;
  } else {
    items.forEach(item => {
      const statusClass = item.status ? `status-${item.status}` : '';
      const statusDot = item.status ? `<span class="status ${statusClass}"></span>` : '';
      
      html += `
        <div class="list-item" data-id="${item.id}" onclick="window.location.hash = '/items/${item.id}'">
          <span>${item.name}</span>
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

// Create view
export async function createView() {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const preselectedAreaTypeId = urlParams.get('areaTypeId');
  
  const areaTypes = await AreaModel.getAllAreaTypes();
  
  let html = `
    <div class="card">
      <h2>New Area</h2>
      <form id="area-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="areaTypeId">Area Type</label>
          <select id="areaTypeId" name="areaTypeId" required>
            <option value="">Select Area Type</option>
  `;
  
  areaTypes.forEach(areaType => {
    const selected = preselectedAreaTypeId && parseInt(preselectedAreaTypeId) === areaType.id ? 'selected' : '';
    html += `<option value="${areaType.id}" ${selected}>${areaType.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/areas'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const areaTypeIdInput = document.getElementById('areaTypeId');
        
        const name = nameInput.value.trim();
        const areaTypeId = parseInt(areaTypeIdInput.value);
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!areaTypeId) {
          alert('Please select an area type');
          return;
        }
        
        try {
          const area = { name, areaTypeId };
          const id = await import('../models/area.js').then(module => module.create(area));
          
          // If we came from an area type detail view, go back there
          const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
          const fromAreaType = urlParams.get('areaTypeId');
          
          if (fromAreaType) {
            window.location.hash = '/area-types/' + fromAreaType;
          } else {
            window.location.hash = '/areas';
          }
        } catch (error) {
          console.error('Error creating area:', error);
          alert('Error creating area: ' + error.message);
        }
      });
    </script>
  `;
  
  return html;
}

// Edit view
export async function editView(id) {
  const area = await AreaModel.getById(parseInt(id));
  
  if (!area) {
    return `<div class="error">Area not found</div>`;
  }
  
  const areaTypes = await AreaModel.getAllAreaTypes();
  
  let html = `
    <div class="card">
      <h2>Edit Area</h2>
      <form id="area-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value="${area.name}" required>
        </div>
        <div class="form-group">
          <label for="areaTypeId">Area Type</label>
          <select id="areaTypeId" name="areaTypeId" required>
  `;
  
  areaTypes.forEach(areaType => {
    const selected = area.areaTypeId === areaType.id ? 'selected' : '';
    html += `<option value="${areaType.id}" ${selected}>${areaType.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/areas/${area.id}'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" id="delete-btn">Delete</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const areaTypeIdInput = document.getElementById('areaTypeId');
        
        const name = nameInput.value.trim();
        const areaTypeId = parseInt(areaTypeIdInput.value);
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!areaTypeId) {
          alert('Please select an area type');
          return;
        }
        
        try {
          const area = { id: ${area.id}, name, areaTypeId };
          await import('../models/area.js').then(module => module.update(area));
          window.location.hash = '/areas';
        } catch (error) {
          console.error('Error updating area:', error);
          alert('Error updating area: ' + error.message);
        }
      });
      
      document.getElementById('delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this area? This will also delete all associated items.')) {
          try {
            await import('../models/area.js').then(module => module.remove(${area.id}));
            window.location.hash = '/areas';
          } catch (error) {
            console.error('Error deleting area:', error);
            alert('Error deleting area: ' + error.message);
          }
        }
      });
    </script>
  `;
  
  return html;
}

