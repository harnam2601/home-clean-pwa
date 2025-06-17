// Area Types UI component
import * as AreaTypeModel from '../models/areaType.js';
import router from './app.js';

// List view
export async function listView() {
  const areaTypes = await AreaTypeModel.getAll();
  
  let html = `
    <div class="card">
      <h2>Area Types</h2>
      <div class="list">
  `;
  
  if (areaTypes.length === 0) {
    html += `<p class="empty-list">No area types found. Add your first one!</p>`;
  } else {
    areaTypes.forEach(areaType => {
      html += `
        <div class="list-item" data-id="${areaType.id}" onclick="window.location.hash = '/area-types/${areaType.id}'">
          <span>${areaType.name}</span>
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
  const areaType = await AreaTypeModel.getById(parseInt(id));
  const areas = await AreaTypeModel.getAreas(parseInt(id));
  
  if (!areaType) {
    return `<div class="error">Area Type not found</div>`;
  }
  
  let html = `
    <div class="card">
      <h2>${areaType.name}</h2>
      <div class="actions">
        <button class="btn-secondary" onclick="window.location.hash = '/area-types/${areaType.id}/edit'">Edit</button>
      </div>
    </div>
    
    <div class="card">
      <h3>Areas</h3>
      <div class="list">
  `;
  
  if (areas.length === 0) {
    html += `<p class="empty-list">No areas in this category yet.</p>`;
  } else {
    areas.forEach(area => {
      html += `
        <div class="list-item" data-id="${area.id}" onclick="window.location.hash = '/areas/${area.id}'">
          <span>${area.name}</span>
          <span class="chevron">›</span>
        </div>
      `;
    });
  }
  
  html += `
      </div>
      <div class="actions">
        <button class="btn-primary" onclick="window.location.hash = '/areas/new?areaTypeId=${areaType.id}'">Add Area</button>
      </div>
    </div>
  `;
  
  return html;
}

// Create view
export function createView() {
  return `
    <div class="card">
      <h2>New Area Type</h2>
      <form id="area-type-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/area-types'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-type-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        try {
          const areaType = { name };
          const id = await import('../models/areaType.js').then(module => module.create(areaType));
          window.location.hash = '/area-types';
        } catch (error) {
          console.error('Error creating area type:', error);
          alert('Error creating area type: ' + error.message);
        }
      });
    </script>
  `;
}

// Edit view
export async function editView(id) {
  const areaType = await AreaTypeModel.getById(parseInt(id));
  
  if (!areaType) {
    return `<div class="error">Area Type not found</div>`;
  }
  
  return `
    <div class="card">
      <h2>Edit Area Type</h2>
      <form id="area-type-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value="${areaType.name}" required>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/area-types/${areaType.id}'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" id="delete-btn">Delete</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-type-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        try {
          const areaType = { id: ${areaType.id}, name };
          await import('../models/areaType.js').then(module => module.update(areaType));
          window.location.hash = '/area-types';
        } catch (error) {
          console.error('Error updating area type:', error);
          alert('Error updating area type: ' + error.message);
        }
      });
      
      document.getElementById('delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this area type? This will also delete all associated areas.')) {
          try {
            await import('../models/areaType.js').then(module => module.remove(${areaType.id}));
            window.location.hash = '/area-types';
          } catch (error) {
            console.error('Error deleting area type:', error);
            alert('Error deleting area type: ' + error.message);
          }
        }
      });
    </script>
  `;
}

