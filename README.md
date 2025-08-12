# Home-Clean PWA

A 100% offline-first, single-user Progressive Web App (PWA) that helps you track cleaning and maintenance tasks for items in your home. The interface is built with [Preact](https://preactjs.com/) using [HTM](https://github.com/developit/htm) for JSX-free templating and a small state manager powered by [preact signals](https://preactjs.com/guide/v10/signals/).

## Features

- **Area Types Management**: Create categories for different types of areas in your home (e.g., Room, Living, Dining, Balcony).
- **Areas Management**: Define specific areas in your home, each belonging to an area type (e.g., Kitchen of type Room).
- **Area Groups**: Create named sets of existing areas (e.g., Downstairs, Wet Areas) with many-to-many relationships.
- **Items Management**: Track unique physical objects located in specific areas (e.g., Fridge in Kitchen).
- **Item Parts Management**: Define sub-components of items that need maintenance (e.g., Fridge → Door Seal).
- **Maintenance Tracking**: Each item part stores frequency (in days) and last maintenance date, with color-coded status indicators.
- **Simple Navigation**: Easy-to-use interface with hamburger menu navigation built with `preact-router`.
- **Offline Functionality**: Works 100% offline with all data stored locally on your device.
- **Export/Import**: Backup and restore your data to transfer between devices.

## Installation

### As a PWA on Mobile

1. Open the application URL in your mobile browser (Chrome, Safari, etc.)
2. For iOS:
   - Tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Confirm by tapping "Add"
3. For Android:
   - Tap the menu button (three dots)
   - Tap "Add to Home Screen" or "Install App"
   - Follow the prompts to install

### As a PWA on Desktop

1. Open the application URL in your desktop browser (Chrome, Edge, etc.)
2. Look for the install icon in the address bar or menu
3. Click "Install" and follow the prompts

### Running Locally

1. Clone or download this repository
2. Navigate to the project directory
3. Start a local server:
   ```
   python -m http.server 8080
   ```
   or any other static file server
4. Open `http://localhost:8080` in your browser

## Deployment

When hosting on AWS S3 or similar static file services, set both the index document and error document to `index.html`. This ensures that all routes managed by `preact-router` correctly fall back to the main page.

## Usage Guide

### Area Types

Area Types are categories for the different types of areas in your home.

- **View Area Types**: Open the app and navigate to "Area Types" from the menu
- **Add Area Type**: Click the "+" button on the Area Types screen
- **Edit Area Type**: Click on an Area Type to view details, then click "Edit"
- **Delete Area Type**: On the edit screen, click "Delete"

### Areas

Areas are specific locations in your home, each belonging to an Area Type.

- **View Areas**: Navigate to "Areas" from the menu
- **Add Area**: Click the "+" button on the Areas screen
- **Edit Area**: Click on an Area to view details, then click "Edit"
- **Delete Area**: On the edit screen, click "Delete"

### Area Groups

Area Groups are collections of Areas that you can group together.

- **View Area Groups**: Navigate to "Area Groups" from the menu
- **Add Area Group**: Click the "+" button on the Area Groups screen
- **Edit Area Group**: Click on an Area Group to view details, then click "Edit"
- **Add Areas to Group**: On the Area Group details screen, click "Add Area"
- **Remove Areas from Group**: On the Area Group details screen, click "Remove" next to an area
- **Delete Area Group**: On the edit screen, click "Delete"

### Items

Items are physical objects located in specific Areas.

- **View Items**: Navigate to "Items" from the menu, or view items within a specific Area
- **Add Item**: Click the "+" button on the Items screen or within an Area
- **Edit Item**: Click on an Item to view details, then click "Edit"
- **Delete Item**: On the edit screen, click "Delete"

### Item Parts

Item Parts are components of Items that require maintenance.

- **View Item Parts**: Click on an Item to see its parts
- **Add Item Part**: Click the "+" button within an Item's details
- **Edit Item Part**: Click on an Item Part to view details, then click "Edit"
- **Mark as Done**: On the Item Part details screen, click "Mark Done"
- **Delete Item Part**: On the edit screen, click "Delete"

### Maintenance Status

Item Parts show maintenance status using color coding:

- **Green**: On schedule (maintenance was done recently)
- **Yellow**: Due soon (approaching the maintenance frequency)
- **Red**: Overdue (past the maintenance frequency)

### Export/Import

To backup or transfer your data:

- **Export Data**: Navigate to "Export/Import" from the menu and click "Export Data"
- **Import Data**: Navigate to "Export/Import" from the menu, select a backup file, and click "Import"

## Technical Details

- Built with [Preact](https://preactjs.com/), [HTM](https://github.com/developit/htm) and [`preact-router`](https://github.com/preactjs/preact-router)
- State managed with a lightweight [preact signals](https://preactjs.com/guide/v10/signals/) store (`state/store.js`)
- Uses IndexedDB for local storage via the lightweight idb library
- Implements the Progressive Web App standard for offline functionality
- Responsive design works on mobile and desktop devices

## Privacy

- All data is stored locally on your device
- No data is sent to any server
- No authentication or cloud storage is used

## License

This project is open source and available under the MIT License.

## Author

Created by Manus AI

