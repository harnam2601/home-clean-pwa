// Area Groups UI component
import * as AreaGroupModel from '../models/areaGroup.js';

// List view
export async function listView() {
  const areaGroups = await AreaGroupModel.getAll();
  
  let html = `
    <div class="card">
      <h2>Area Groups</h2>
      <div class="list">
  `;
  
  if (areaGroups.length === 0) {
    html += `<p class="empty-list">No area groups found. Add your first one!</p>`;
  } else {
    areaGroups.forEach(areaGroup => {
      html += `
        <div class="list-item" data-id="${areaGroup.id}" onclick="window.location.hash = '/area-groups/${areaGroup.id}'">
          <span>${areaGroup.name}</span>
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
  const areaGroup = await AreaGroupModel.getById(parseInt(id));
  
  if (!areaGroup) {
    return `<div class="error">Area Group not found</div>`;
  }
  
  const areas = await AreaGroupModel.getAreas(areaGroup.id);
  
  let html = `
    <div class="card">
      <h2>${areaGroup.name}</h2>
      <div class="actions">
        <button class="btn-secondary" onclick="window.location.hash = '/area-groups/${areaGroup.id}/edit'">Edit</button>
      </div>
    </div>
    
    <div class="card">
      <h3>Areas in this Group</h3>
      <div class="list">
  `;
  
  if (areas.length === 0) {
    html += `<p class="empty-list">No areas in this group yet.</p>`;
  } else {
    areas.forEach(area => {
      html += `
        <div class="list-item" data-id="${area.id}">
          <span>${area.name}</span>
          <button class="btn-danger btn-small" onclick="removeAreaFromGroup(event, ${areaGroup.id}, ${area.id})">Remove</button>
        </div>
      `;
    });
  }
  
  html += `
      </div>
      <div class="actions">
        <button class="btn-primary" id="add-area-btn">Add Area</button>
      </div>
    </div>
    
    <div id="add-area-modal" class="modal hidden">
      <div class="modal-content">
        <h3>Add Area to Group</h3>
        <div class="list" id="available-areas-list">
          <p class="loading">Loading available areas...</p>
        </div>
        <div class="actions">
          <button class="btn-secondary" id="close-modal-btn">Cancel</button>
        </div>
      </div>
    </div>
    
    <script>
      // Remove area from group
      window.removeAreaFromGroup = async (event, groupId, areaId) => {
        event.stopPropagation();
        
        if (confirm('Are you sure you want to remove this area from the group?')) {
          try {
            await import('../models/areaGroup.js').then(module => module.removeArea(groupId, areaId));
            window.location.reload();
          } catch (error) {
            console.error('Error removing area from group:', error);
            alert('Error removing area from group: ' + error.message);
          }
        }
      };
      
      // Add area modal
      const modal = document.getElementById('add-area-modal');
      const addAreaBtn = document.getElementById('add-area-btn');
      const closeModalBtn = document.getElementById('close-modal-btn');
      const availableAreasList = document.getElementById('available-areas-list');
      
      addAreaBtn.addEventListener('click', async () => {
        modal.classList.remove('hidden');
        
        try {
          const availableAreas = await import('../models/areaGroup.js')
            .then(module => module.getAreasNotInGroup(${areaGroup.id}));
          
          if (availableAreas.length === 0) {
            availableAreasList.innerHTML = '<p class="empty-list">No available areas to add.</p>';
          } else {
            let html = '';
            availableAreas.forEach(area => {
              html += \`
                <div class="list-item" data-id="\${area.id}">
                  <span>\${area.name}</span>
                  <button class="btn-primary btn-small" onclick="addAreaToGroup(event, ${areaGroup.id}, \${area.id})">Add</button>
                </div>
              \`;
            });
            availableAreasList.innerHTML = html;
          }
        } catch (error) {
          console.error('Error loading available areas:', error);
          availableAreasList.innerHTML = '<p class="error">Error loading available areas.</p>';
        }
      });
      
      closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
      
      // Add area to group
      window.addAreaToGroup = async (event, groupId, areaId) => {
        event.stopPropagation();
        
        try {
          await import('../models/areaGroup.js').then(module => module.addArea(groupId, areaId));
          window.location.reload();
        } catch (error) {
          console.error('Error adding area to group:', error);
          alert('Error adding area to group: ' + error.message);
        }
      };
    </script>
    
    <style>
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
      }
      
      .modal.hidden {
        display: none;
      }
      
      .modal-content {
        background-color: white;
        padding: 1rem;
        border-radius: 4px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .btn-small {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
      }
    </style>
  `;
  
  return html;
}

// Create view
export function createView() {
  return `
    <div class="card">
      <h2>New Area Group</h2>
      <form id="area-group-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/area-groups'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-group-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        try {
          const areaGroup = { name };
          const id = await import('../models/areaGroup.js').then(module => module.create(areaGroup));
          window.location.hash = '/area-groups';
        } catch (error) {
          console.error('Error creating area group:', error);
          alert('Error creating area group: ' + error.message);
        }
      });
    </script>
  `;
}

// Edit view
export async function editView(id) {
  const areaGroup = await AreaGroupModel.getById(parseInt(id));
  
  if (!areaGroup) {
    return `<div class="error">Area Group not found</div>`;
  }
  
  return `
    <div class="card">
      <h2>Edit Area Group</h2>
      <form id="area-group-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value="${areaGroup.name}" required>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/area-groups/${areaGroup.id}'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" id="delete-btn">Delete</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('area-group-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const name = nameInput.value.trim();
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        try {
          const areaGroup = { id: ${areaGroup.id}, name };
          await import('../models/areaGroup.js').then(module => module.update(areaGroup));
          window.location.hash = '/area-groups';
        } catch (error) {
          console.error('Error updating area group:', error);
          alert('Error updating area group: ' + error.message);
        }
      });
      
      document.getElementById('delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this area group?')) {
          try {
            await import('../models/areaGroup.js').then(module => module.remove(${areaGroup.id}));
            window.location.hash = '/area-groups';
          } catch (error) {
            console.error('Error deleting area group:', error);
            alert('Error deleting area group: ' + error.message);
          }
        }
      });
    </script>
  `;
}

