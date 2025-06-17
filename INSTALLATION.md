# Home-Clean PWA Installation Guide

This document provides detailed instructions for installing and deploying the Home-Clean PWA.

## Local Development

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (Python's built-in server, Node.js http-server, etc.)

### Steps

1. Clone or download the repository:
   ```
   git clone https://github.com/yourusername/home-clean-pwa.git
   ```
   or download and extract the ZIP file.

2. Navigate to the project directory:
   ```
   cd home-clean-pwa
   ```

3. Start a local web server:

   Using Python (Python 3):
   ```
   python -m http.server 8080
   ```

   Using Python (Python 2):
   ```
   python -m SimpleHTTPServer 8080
   ```

   Using Node.js http-server (requires installation via npm):
   ```
   npx http-server -p 8080
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

5. The app should now be running locally.

## Deployment to a Web Server

### Prerequisites

- Access to a web server (Apache, Nginx, etc.)
- FTP or SSH access to upload files

### Steps

1. Build the project (no build step required as this is vanilla JS)

2. Upload all files to your web server:
   - Using FTP: Upload all files to your web hosting directory
   - Using SCP: `scp -r * username@your-server:/path/to/web/directory`

3. Ensure your web server is configured to serve static files correctly.

4. For Apache, you may need a `.htaccess` file with:
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

5. For Nginx, add to your server configuration:
   ```
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

6. Visit your website URL to access the application.

## Installing as a PWA

### On Mobile Devices

#### iOS (Safari)

1. Open the application in Safari
2. Tap the Share button (rectangle with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Enter a name for the app (or keep the default)
5. Tap "Add" in the top-right corner
6. The app icon will appear on your home screen

#### Android (Chrome)

1. Open the application in Chrome
2. Tap the menu button (three dots in the top-right)
3. Tap "Add to Home screen" or "Install app"
4. Follow the prompts to add the app
5. The app icon will appear on your home screen

### On Desktop

#### Chrome/Edge/Brave

1. Open the application in the browser
2. Look for the install icon in the address bar (usually a "+" or computer icon)
3. Click the icon and follow the prompts
4. The app will be installed and can be launched from your desktop or start menu

#### Firefox

1. Open the application in Firefox
2. Look for the install icon in the address bar (home icon with a plus)
3. Click the icon and follow the prompts
4. The app will be installed and can be launched from your desktop or start menu

## Troubleshooting

### App Not Installing as PWA

- Ensure you're using HTTPS or localhost (PWAs require secure contexts)
- Check that all required PWA files are present (manifest.json, service worker)
- Verify the manifest.json has all required fields
- Make sure the service worker is registered correctly

### Offline Functionality Not Working

- Check that the service worker is registered (look in browser DevTools > Application > Service Workers)
- Ensure all required files are cached by the service worker
- Try clearing the browser cache and reloading the app

### IndexedDB Issues

- Check browser console for errors related to IndexedDB
- Ensure your browser supports IndexedDB
- Try clearing site data if database is corrupted

## Support

If you encounter any issues with installation or deployment, please:

1. Check the browser console for error messages
2. Verify your server configuration
3. Ensure all files are correctly uploaded
4. File an issue on the project repository with detailed information about the problem

## Updates

To update an existing installation:

1. Replace all files on the server with the new version
2. Users may need to refresh the app or clear their cache to get the latest version
3. The service worker should handle updating cached files automatically

