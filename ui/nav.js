import { html, useState } from 'https://esm.sh/htm/preact/standalone';
import { Link } from 'https://esm.sh/preact-router';

// Navigation component using preact-router Link
export const Nav = ({ currentUrl }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const isActive = href => currentUrl && currentUrl.startsWith(href);
  return html`
    <header>
      <h1>Home-Clean</h1>
      <button id="menu-toggle" aria-label="Menu" onClick=${() => setOpen(true)}>≡</button>
    </header>
    <nav id="main-nav" class=${open ? 'visible' : 'hidden'}>
      <button id="close-menu" aria-label="Close menu" onClick=${close}>✕</button>
      <ul>
        <li class=${isActive('/area-types') ? 'active' : ''}><${Link} href="/area-types" onClick=${close}>Area Types<//></li>
        <li class=${isActive('/areas') ? 'active' : ''}><${Link} href="/areas" onClick=${close}>Areas<//></li>
        <li class=${isActive('/area-groups') ? 'active' : ''}><${Link} href="/area-groups" onClick=${close}>Area Groups<//></li>
        <li class=${isActive('/items') ? 'active' : ''}><${Link} href="/items" onClick=${close}>Items<//></li>
        <li class=${isActive('/export-import') ? 'active' : ''}><${Link} href="/export-import" onClick=${close}>Export/Import<//></li>
      </ul>
    </nav>
  `;
};

