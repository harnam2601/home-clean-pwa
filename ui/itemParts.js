// Item Parts UI component
import * as ItemPartModel from '../models/itemPart.js';
import { calculateStatus } from '../db.js';
import router from './app.js';

// Detail view
export async function detailView(id) {
  const itemPart = await ItemPartModel.getById(parseInt(id));
  
  if (!itemPart) {
    return `<div class="error">Item Part not found</div>`;
  }
  
  const item = await ItemPartModel.getItem(itemPart.itemId);
  const status = calculateStatus(itemPart.freqDays, itemPart.lastDoneAt);
  
  // Calculate days since last done and next due date
  let daysSince = null;
  let nextDueDate = null;
  
  if (itemPart.lastDoneAt) {
    const now = new Date();
    const lastDone = new Date(itemPart.lastDoneAt);
    daysSince = Math.floor((now - lastDone) / (1000 * 60 * 60 * 24));
    
    // Calculate next due date
    nextDueDate = new Date(lastDone);
    nextDueDate.setDate(nextDueDate.getDate() + itemPart.freqDays);
  }
  
  // Format status text
  let statusText = '';
  switch (status) {
    case 'green':
      statusText = 'ON SCHEDULE';
      break;
    case 'yellow':
      statusText = 'DUE SOON';
      break;
    case 'red':
      statusText = 'OVERDUE';
      break;
  }
  
  let html = `
    <div class="card">
      <h2>${itemPart.name} <small>(${item ? item.name : 'Unknown'})</small></h2>
      <div class="status-banner status-${status}">
        <div class="status-text">${statusText}</div>
        <div class="status ${status}"></div>
      </div>
      
      <div class="details">
        <div class="detail-row">
          <div class="detail-label">Frequency:</div>
          <div class="detail-value">Every ${itemPart.freqDays} days</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">Last done:</div>
          <div class="detail-value">
            ${itemPart.lastDoneAt 
              ? `${daysSince} days ago (${new Date(itemPart.lastDoneAt).toLocaleDateString()})`
              : 'Never'}
          </div>
        </div>
        
        ${nextDueDate ? `
        <div class="detail-row">
          <div class="detail-label">Next due:</div>
          <div class="detail-value">${nextDueDate.toLocaleDateString()}</div>
        </div>
        ` : ''}
      </div>
      
      <div class="actions">
        <button id="mark-done-btn" class="btn-primary">Mark Done</button>
        <button class="btn-secondary" onclick="window.location.hash = '/item-parts/${itemPart.id}/edit'">Edit</button>
      </div>
    </div>
    
    <script>
      document.getElementById('mark-done-btn').addEventListener('click', async () => {
        try {
          await import('../models/itemPart.js').then(module => module.markDone(${itemPart.id}));
          
          // Show success animation
          const statusBanner = document.querySelector('.status-banner');
          statusBanner.classList.add('status-changed');
          
          // Reload after animation
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          console.error('Error marking item part as done:', error);
          alert('Error marking item part as done: ' + error.message);
        }
      });
    </script>
    
    <style>
      .status-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        margin: 1rem 0;
        border-radius: 4px;
      }
      
      .status-green {
        background-color: rgba(76, 175, 80, 0.2);
      }
      
      .status-yellow {
        background-color: rgba(255, 193, 7, 0.2);
      }
      
      .status-red {
        background-color: rgba(244, 67, 54, 0.2);
      }
      
      .status-text {
        font-weight: bold;
      }
      
      .details {
        margin: 1.5rem 0;
      }
      
      .detail-row {
        display: flex;
        margin-bottom: 0.5rem;
      }
      
      .detail-label {
        font-weight: bold;
        width: 100px;
      }
      
      .detail-value {
        flex: 1;
      }
    </style>
  `;
  
  return html;
}

// Create view
export async function createView() {
  // Get query parameters
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const preselectedItemId = urlParams.get('itemId');
  
  const items = await ItemPartModel.getAllItems();
  
  let html = `
    <div class="card">
      <h2>New Item Part</h2>
      <form id="item-part-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="itemId">Item</label>
          <select id="itemId" name="itemId" required>
            <option value="">Select Item</option>
  `;
  
  items.forEach(item => {
    const selected = preselectedItemId && parseInt(preselectedItemId) === item.id ? 'selected' : '';
    html += `<option value="${item.id}" ${selected}>${item.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="form-group">
          <label for="freqDays">Frequency (days)</label>
          <input type="number" id="freqDays" name="freqDays" min="1" value="30" required>
        </div>
        <div class="form-group">
          <label for="lastDoneAt">Last Done</label>
          <input type="date" id="lastDoneAt" name="lastDoneAt">
          <small>Leave blank if never done before</small>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="history.back()">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('item-part-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const itemIdInput = document.getElementById('itemId');
        const freqDaysInput = document.getElementById('freqDays');
        const lastDoneAtInput = document.getElementById('lastDoneAt');
        
        const name = nameInput.value.trim();
        const itemId = parseInt(itemIdInput.value);
        const freqDays = parseInt(freqDaysInput.value);
        const lastDoneAt = lastDoneAtInput.value ? new Date(lastDoneAtInput.value).toISOString() : null;
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!itemId) {
          alert('Please select an item');
          return;
        }
        
        if (!freqDays || freqDays < 1) {
          alert('Please enter a valid frequency');
          return;
        }
        
        try {
          const itemPart = { name, itemId, freqDays, lastDoneAt };
          const id = await import('../models/itemPart.js').then(module => module.create(itemPart));
          
          // If we came from an item detail view, go back there
          const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
          const fromItem = urlParams.get('itemId');
          
          if (fromItem) {
            window.location.hash = '/items/' + fromItem;
          } else {
            window.location.hash = '/items';
          }
        } catch (error) {
          console.error('Error creating item part:', error);
          alert('Error creating item part: ' + error.message);
        }
      });
    </script>
  `;
  
  return html;
}

// Edit view
export async function editView(id) {
  const itemPart = await ItemPartModel.getById(parseInt(id));
  
  if (!itemPart) {
    return `<div class="error">Item Part not found</div>`;
  }
  
  const items = await ItemPartModel.getAllItems();
  
  // Format date for input
  let lastDoneAtValue = '';
  if (itemPart.lastDoneAt) {
    const date = new Date(itemPart.lastDoneAt);
    lastDoneAtValue = date.toISOString().split('T')[0];
  }
  
  let html = `
    <div class="card">
      <h2>Edit Item Part</h2>
      <form id="item-part-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" value="${itemPart.name}" required>
        </div>
        <div class="form-group">
          <label for="itemId">Item</label>
          <select id="itemId" name="itemId" required>
  `;
  
  items.forEach(item => {
    const selected = itemPart.itemId === item.id ? 'selected' : '';
    html += `<option value="${item.id}" ${selected}>${item.name}</option>`;
  });
  
  html += `
          </select>
        </div>
        <div class="form-group">
          <label for="freqDays">Frequency (days)</label>
          <input type="number" id="freqDays" name="freqDays" min="1" value="${itemPart.freqDays}" required>
        </div>
        <div class="form-group">
          <label for="lastDoneAt">Last Done</label>
          <input type="date" id="lastDoneAt" name="lastDoneAt" value="${lastDoneAtValue}">
          <small>Leave blank if never done before</small>
        </div>
        <div class="btn-group">
          <button type="button" class="btn-secondary" onclick="window.location.hash = '/item-parts/${itemPart.id}'">Cancel</button>
          <button type="submit" class="btn-primary">Save</button>
          <button type="button" class="btn-danger" id="delete-btn">Delete</button>
        </div>
      </form>
    </div>
    
    <script>
      document.getElementById('item-part-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const itemIdInput = document.getElementById('itemId');
        const freqDaysInput = document.getElementById('freqDays');
        const lastDoneAtInput = document.getElementById('lastDoneAt');
        
        const name = nameInput.value.trim();
        const itemId = parseInt(itemIdInput.value);
        const freqDays = parseInt(freqDaysInput.value);
        const lastDoneAt = lastDoneAtInput.value ? new Date(lastDoneAtInput.value).toISOString() : null;
        
        if (!name) {
          alert('Please enter a name');
          return;
        }
        
        if (!itemId) {
          alert('Please select an item');
          return;
        }
        
        if (!freqDays || freqDays < 1) {
          alert('Please enter a valid frequency');
          return;
        }
        
        try {
          const itemPart = { id: ${itemPart.id}, name, itemId, freqDays, lastDoneAt };
          await import('../models/itemPart.js').then(module => module.update(itemPart));
          window.location.hash = '/item-parts/${itemPart.id}';
        } catch (error) {
          console.error('Error updating item part:', error);
          alert('Error updating item part: ' + error.message);
        }
      });
      
      document.getElementById('delete-btn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this item part?')) {
          try {
            await import('../models/itemPart.js').then(module => module.remove(${itemPart.id}));
            window.location.hash = '/items/${itemPart.itemId}';
          } catch (error) {
            console.error('Error deleting item part:', error);
            alert('Error deleting item part: ' + error.message);
          }
        }
      });
    </script>
  `;
  
  return html;
}

