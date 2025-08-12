import { html } from 'https://esm.sh/htm/preact?deps=preact@10';
import Router from 'https://esm.sh/preact-router?deps=preact@10';
import { Nav } from './nav.js';

// Simple placeholder component for routes
const Placeholder = ({ title }) => html`<div class="card"><h2>${title}</h2></div>`;

export const App = () => html`
  <${Nav}/>
  <main id="app-content">
    <${Router}>
      <${Placeholder} path="/" title="Home" />
      <${Placeholder} path="/area-types" title="Area Types" />
      <${Placeholder} path="/area-types/:id" title="Area Type Detail" />
      <${Placeholder} path="/area-types/new" title="New Area Type" />
      <${Placeholder} path="/area-types/:id/edit" title="Edit Area Type" />
      <${Placeholder} path="/areas" title="Areas" />
      <${Placeholder} path="/areas/new" title="New Area" />
      <${Placeholder} path="/areas/:id" title="Area Detail" />
      <${Placeholder} path="/areas/:id/edit" title="Edit Area" />
      <${Placeholder} path="/area-groups" title="Area Groups" />
      <${Placeholder} path="/area-groups/new" title="New Area Group" />
      <${Placeholder} path="/area-groups/:id" title="Area Group Detail" />
      <${Placeholder} path="/area-groups/:id/edit" title="Edit Area Group" />
      <${Placeholder} path="/items" title="Items" />
      <${Placeholder} path="/items/new" title="New Item" />
      <${Placeholder} path="/items/:id" title="Item Detail" />
      <${Placeholder} path="/items/:id/edit" title="Edit Item" />
      <${Placeholder} path="/item-parts/new" title="New Item Part" />
      <${Placeholder} path="/item-parts/:id" title="Item Part Detail" />
      <${Placeholder} path="/item-parts/:id/edit" title="Edit Item Part" />
      <${Placeholder} path="/export-import" title="Export/Import" />
    <//>
  </main>
`;

