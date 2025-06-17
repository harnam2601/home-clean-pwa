// Simple hash-based router for the PWA

class Router {
  constructor(routes, defaultRoute) {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    this.currentRoute = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    // Handle hash changes
    window.addEventListener('hashchange', () => this.handleRouteChange());
    
    // Handle initial load
    this.handleRouteChange();
  }
  
  handleRouteChange() {
    // Get the hash without the # symbol
    const hash = window.location.hash.slice(1) || '/';
    
    // Find matching route
    let matchedRoute = null;
    let params = {};
    
    for (const route of this.routes) {
      // Convert route pattern to regex
      const pattern = this.patternToRegex(route.path);
      const match = hash.match(pattern);
      
      if (match) {
        matchedRoute = route;
        
        // Extract params
        const keys = route.path.match(/:[^/]+/g) || [];
        keys.forEach((key, index) => {
          const paramName = key.slice(1); // Remove the : prefix
          params[paramName] = match[index + 1];
        });
        
        break;
      }
    }
    
    // Use default route if no match found
    if (!matchedRoute) {
      matchedRoute = this.defaultRoute;
    }
    
    // Update current route
    this.currentRoute = {
      ...matchedRoute,
      params
    };
    
    // Render the route
    this.renderRoute();
  }
  
  patternToRegex(pattern) {
    // Convert route pattern to regex
    // e.g., '/items/:id' becomes /^\/items\/([^/]+)$/
    const regexPattern = pattern
      .replace(/:[^/]+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    
    return new RegExp(`^${regexPattern}$`);
  }
  
  renderRoute() {
    // Get the content element
    const contentElement = document.getElementById('app-content');
    
    // Show loading state
    contentElement.innerHTML = '<div class="loading">Loading...</div>';
    
    // Call the handler function
    Promise.resolve(this.currentRoute.handler(this.currentRoute.params))
      .then(content => {
        // Update the content
        contentElement.innerHTML = content;
        
        // Update the add button visibility and action
        this.updateAddButton();
        
        // Execute any scripts in the content
        this.executeScripts(contentElement);
      })
      .catch(error => {
        console.error('Error rendering route:', error);
        contentElement.innerHTML = '<div class="error">Error loading content</div>';
      });
  }
  
  updateAddButton() {
    const addButton = document.getElementById('add-button');
    
    // Check if the current route has an add action
    if (this.currentRoute.addAction) {
      addButton.classList.remove('hidden');
      addButton.onclick = this.currentRoute.addAction;
    } else {
      addButton.classList.add('hidden');
      addButton.onclick = null;
    }
  }
  
  executeScripts(element) {
    // Find and execute any script tags in the content
    const scripts = element.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy content
      newScript.textContent = oldScript.textContent;
      
      // Replace old script with new one
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }
  
  navigate(path) {
    window.location.hash = path;
  }
}

export default Router;

