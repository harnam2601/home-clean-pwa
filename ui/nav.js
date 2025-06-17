// Navigation component

export function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenu = document.getElementById('close-menu');
  const nav = document.getElementById('main-nav');
  const navLinks = nav.querySelectorAll('a');
  
  // Toggle menu
  menuToggle.addEventListener('click', () => {
    nav.classList.remove('hidden');
    nav.classList.add('visible');
  });
  
  // Close menu
  closeMenu.addEventListener('click', () => {
    nav.classList.remove('visible');
    nav.classList.add('hidden');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (
      !nav.contains(event.target) && 
      !menuToggle.contains(event.target) &&
      nav.classList.contains('visible')
    ) {
      nav.classList.remove('visible');
      nav.classList.add('hidden');
    }
  });
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('visible');
      nav.classList.add('hidden');
    });
  });
}

