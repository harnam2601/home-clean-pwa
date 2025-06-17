# Home-Clean PWA Architecture

## Project Structure

```
home-clean-pwa/
├── index.html          # Main HTML file
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── db.js              # IndexedDB setup and operations
├── router.js          # Simple hash router
├── styles.css         # Global styles
├── models/            # Data models
│   ├── areaType.js    # Area Type model
│   ├── area.js        # Area model
│   ├── areaGroup.js   # Area Group model
│   ├── item.js        # Item model
│   └── itemPart.js    # Item Part model
└── ui/                # UI components
    ├── app.js         # Main app component
    ├── nav.js         # Navigation component
    ├── areaTypes.js   # Area Types UI
    ├── areas.js       # Areas UI
    ├── areaGroups.js  # Area Groups UI
    ├── items.js       # Items UI
    └── itemParts.js   # Item Parts UI
```

## Data Flow

1. User interactions trigger UI events
2. UI components call model methods
3. Models interact with IndexedDB via db.js
4. UI is updated based on data changes

## IndexedDB Schema

Based on the provided data model:

1. **areaTypes** store:
   - Key path: `id` (auto-incremented)
   - Indexes: `name`

2. **areas** store:
   - Key path: `id` (auto-incremented)
   - Indexes: `name`, `areaTypeId`

3. **areaGroups** store:
   - Key path: `id` (auto-incremented)
   - Indexes: `name`

4. **areaGroupAreas** store:
   - Key path: `[groupId, areaId]`
   - Indexes: `groupId`, `areaId`

5. **items** store:
   - Key path: `id` (auto-incremented)
   - Indexes: `name`, `areaId`

6. **itemParts** store:
   - Key path: `id` (auto-incremented)
   - Indexes: `name`, `itemId`, `lastDoneAt`

## Routing

Simple hash-based routing:
- `#/area-types` - List of Area Types
- `#/area-types/new` - Create new Area Type
- `#/area-types/:id` - Edit Area Type
- Similar patterns for other entities

## UI Components

Each UI component will:
1. Render its own HTML
2. Handle its own events
3. Interact with models
4. Update its own view

## Offline Strategy

1. Service Worker will cache all static assets
2. IndexedDB will store all user data
3. All operations will work offline
4. App will be installable via manifest.json

## Status Calculation

Item Parts will have status calculated based on:
- `freqDays`: Frequency in days
- `lastDoneAt`: Last completion timestamp

Status colors:
- Green: On schedule
- Yellow: Due soon (within 20% of frequency)
- Red: Overdue

## Export/Import

JSON-based export/import:
1. Export all IndexedDB stores to JSON
2. Import JSON back to IndexedDB
3. Preserve all relationships

