import { html, useState } from 'https://esm.sh/htm/preact/standalone';
import { Link } from 'https://esm.sh/preact-router';

// Navigation component using preact-router Link
export const Nav = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return html`
    <header>
      <h1>Home-Clean</h1>
      <button id="menu-toggle" aria-label="Menu" onClick=${() => setOpen(true)}>≡</button>
    </header>
    <nav id="main-nav" class=${open ? 'visible' : 'hidden'}>
      <button id="close-menu" aria-label="Close menu" onClick=${close}>✕</button>
      <ul>
        <li><${Link} href="/area-types" onClick=${close}>Area Types<//></li>
        <li><${Link} href="/areas" onClick=${close}>Areas<//></li>
        <li><${Link} href="/area-groups" onClick=${close}>Area Groups<//></li>
        <li><${Link} href="/items" onClick=${close}>Items<//></li>
        <li><${Link} href="/export-import" onClick=${close}>Export/Import<//></li>
      </ul>
    </nav>
  `;
};

