// Import dependencies
import Router from '../router.js';
import { initNavigation } from './nav.js';
import * as AreaTypes from './areaTypes.js';
import * as Areas from './areas.js';
import * as AreaGroups from './areaGroups.js';
import * as Items from './items.js';
import * as ItemParts from './itemParts.js';

// Define routes
const routes = [
  {
    path: '/',
    handler: () => {
      // Redirect to area types by default
      window.location.hash = '/area-types';
      return '<div class="loading">Redirecting...</div>';
    }
  },
  {
    path: '/area-types',
    handler: AreaTypes.listView,
    addAction: () => router.navigate('/area-types/new')
  },
  {
    path: '/area-types/new',
    handler: AreaTypes.createView
  },
  {
    path: '/area-types/:id',
    handler: params => AreaTypes.detailView(params.id)
  },
  {
    path: '/area-types/:id/edit',
    handler: params => AreaTypes.editView(params.id)
  },
  {
    path: '/areas',
    handler: Areas.listView,
    addAction: () => router.navigate('/areas/new')
  },
  {
    path: '/areas/new',
    handler: Areas.createView
  },
  {
    path: '/areas/:id',
    handler: params => Areas.detailView(params.id),
    addAction: params => {
      const areaId = router.currentRoute.params.id;
      router.navigate(`/items/new?areaId=${areaId}`);
    }
  },
  {
    path: '/areas/:id/edit',
    handler: params => Areas.editView(params.id)
  },
  {
    path: '/area-groups',
    handler: AreaGroups.listView,
    addAction: () => router.navigate('/area-groups/new')
  },
  {
    path: '/area-groups/new',
    handler: AreaGroups.createView
  },
  {
    path: '/area-groups/:id',
    handler: params => AreaGroups.detailView(params.id)
  },
  {
    path: '/area-groups/:id/edit',
    handler: params => AreaGroups.editView(params.id)
  },
  {
    path: '/items',
    handler: Items.listView,
    addAction: () => router.navigate('/items/new')
  },
  {
    path: '/items/new',
    handler: Items.createView
  },
  {
    path: '/items/:id',
    handler: params => Items.detailView(params.id),
    addAction: params => {
      const itemId = router.currentRoute.params.id;
      router.navigate(`/item-parts/new?itemId=${itemId}`);
    }
  },
  {
    path: '/items/:id/edit',
    handler: params => Items.editView(params.id)
  },
  {
    path: '/item-parts/new',
    handler: ItemParts.createView
  },
  {
    path: '/item-parts/:id',
    handler: params => ItemParts.detailView(params.id)
  },
  {
    path: '/item-parts/:id/edit',
    handler: params => ItemParts.editView(params.id)
  },
  {
    path: '/export-import',
    handler: () => {
      return `
        <div class="card">
          <h2>Export/Import Data</h2>
          <div class="form-group">
            <button id="export-btn" class="btn-primary">Export Data</button>
          </div>
          <div class="form-group">
            <label for="import-file">Import Data</label>
            <input type="file" id="import-file" accept=".json">
            <button id="import-btn" class="btn-primary">Import</button>
          </div>
        </div>
        <script>
          import { db } from '../db.js';
          
          // Export data
          document.getElementById('export-btn').addEventListener('click', async () => {
            try {
              const data = await db.exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              
              const a = document.createElement('a');
              a.href = url;
              a.download = 'home-clean-backup.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              
              alert('Data exported successfully!');
            } catch (error) {
              console.error('Export error:', error);
              alert('Error exporting data: ' + error.message);
            }
          });
          
          // Import data
          document.getElementById('import-btn').addEventListener('click', async () => {
            const fileInput = document.getElementById('import-file');
            if (!fileInput.files.length) {
              alert('Please select a file to import');
              return;
            }
            
            try {
              const file = fileInput.files[0];
              const text = await file.text();
              const data = JSON.parse(text);
              
              if (confirm('This will replace all existing data. Are you sure?')) {
                await db.importData(data);
                alert('Data imported successfully!');
                window.location.reload();
              }
            } catch (error) {
              console.error('Import error:', error);
              alert('Error importing data: ' + error.message);
            }
          });
        </script>
      `;
    }
  }
];

// Create router instance
const router = new Router(routes, routes[0]);

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});

// Export router for use in other modules
export default router;

