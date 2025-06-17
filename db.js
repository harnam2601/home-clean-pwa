// Database version
const DB_VERSION = 1;
const DB_NAME = 'home-clean-db';

// Database connection
let dbPromise;

// Initialize the database
function initDB() {
  dbPromise = window.idb.openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('areaTypes')) {
        const areaTypesStore = db.createObjectStore('areaTypes', { keyPath: 'id', autoIncrement: true });
        areaTypesStore.createIndex('name', 'name', { unique: true });
      }
      
      if (!db.objectStoreNames.contains('areas')) {
        const areasStore = db.createObjectStore('areas', { keyPath: 'id', autoIncrement: true });
        areasStore.createIndex('name', 'name', { unique: false });
        areasStore.createIndex('areaTypeId', 'areaTypeId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('areaGroups')) {
        const areaGroupsStore = db.createObjectStore('areaGroups', { keyPath: 'id', autoIncrement: true });
        areaGroupsStore.createIndex('name', 'name', { unique: true });
      }
      
      if (!db.objectStoreNames.contains('areaGroupAreas')) {
        const areaGroupAreasStore = db.createObjectStore('areaGroupAreas', { keyPath: ['groupId', 'areaId'] });
        areaGroupAreasStore.createIndex('groupId', 'groupId', { unique: false });
        areaGroupAreasStore.createIndex('areaId', 'areaId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('items')) {
        const itemsStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
        itemsStore.createIndex('name', 'name', { unique: false });
        itemsStore.createIndex('areaId', 'areaId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('itemParts')) {
        const itemPartsStore = db.createObjectStore('itemParts', { keyPath: 'id', autoIncrement: true });
        itemPartsStore.createIndex('name', 'name', { unique: false });
        itemPartsStore.createIndex('itemId', 'itemId', { unique: false });
        itemPartsStore.createIndex('lastDoneAt', 'lastDoneAt', { unique: false });
      }
    }
  });
  
  return dbPromise;
}

// Initialize the database when the script loads
initDB();

// Generic CRUD operations
const db = {
  // Create a record in a store
  async add(storeName, item) {
    return (await dbPromise).add(storeName, item);
  },
  
  // Get a record by ID
  async get(storeName, id) {
    return (await dbPromise).get(storeName, id);
  },
  
  // Get all records from a store
  async getAll(storeName) {
    return (await dbPromise).getAll(storeName);
  },
  
  // Get records by index
  async getByIndex(storeName, indexName, key) {
    return (await dbPromise).getAllFromIndex(storeName, indexName, key);
  },
  
  // Update a record
  async put(storeName, item) {
    return (await dbPromise).put(storeName, item);
  },
  
  // Delete a record
  async delete(storeName, id) {
    return (await dbPromise).delete(storeName, id);
  },
  
  // Clear a store
  async clear(storeName) {
    return (await dbPromise).clear(storeName);
  },
  
  // Transaction wrapper
  async transaction(storeNames, mode, callback) {
    return (await dbPromise).transaction(storeNames, mode, callback);
  },
  
  // Export all data
  async exportData() {
    const db = await dbPromise;
    const exportData = {};
    
    // Export each store
    for (const storeName of db.objectStoreNames) {
      exportData[storeName] = await db.getAll(storeName);
    }
    
    return exportData;
  },
  
  // Import data
  async importData(data) {
    const db = await dbPromise;
    const tx = db.transaction(Object.keys(data), 'readwrite');
    
    // Clear and import each store
    for (const [storeName, items] of Object.entries(data)) {
      const store = tx.objectStore(storeName);
      await store.clear();
      
      for (const item of items) {
        await store.add(item);
      }
    }
    
    await tx.done;
    return true;
  }
};

// Calculate status based on frequency and last done date
function calculateStatus(freqDays, lastDoneAt) {
  if (!lastDoneAt) return 'red'; // Never done
  
  const now = new Date();
  const lastDone = new Date(lastDoneAt);
  const daysSince = Math.floor((now - lastDone) / (1000 * 60 * 60 * 24));
  
  if (daysSince >= freqDays) {
    return 'red'; // Overdue
  } else if (daysSince >= freqDays * 0.8) {
    return 'yellow'; // Due soon (within 20% of frequency)
  } else {
    return 'green'; // On schedule
  }
}

export { db, calculateStatus };

