import { html } from 'https://esm.sh/htm/preact/standalone';
import Router from 'https://esm.sh/preact-router';
import { Nav } from './nav.js';
import { AreaTypeList, AreaTypeDetail, AreaTypeCreate, AreaTypeEdit } from './areaTypes.js';
import { AreaList, AreaDetail, AreaCreate, AreaEdit } from './areas.js';
import { AreaGroupList, AreaGroupDetail, AreaGroupCreate, AreaGroupEdit } from './areaGroups.js';
import { ItemList, ItemDetail, ItemCreate, ItemEdit } from './items.js';
import { ItemPartDetail, ItemPartCreate, ItemPartEdit } from './itemParts.js';

// Simple placeholder component for routes
const Placeholder = ({ title }) => html`<div class="card"><h2>${title}</h2></div>`;

export const App = () => html`
  <${Nav}/>
  <main id="app-content">
    <${Router}>
      <${Placeholder} path="/" title="Home" />
      <${AreaTypeList} path="/area-types" />
      <${AreaTypeDetail} path="/area-types/:id" />
      <${AreaTypeCreate} path="/area-types/new" />
      <${AreaTypeEdit} path="/area-types/:id/edit" />
      <${AreaList} path="/areas" />
      <${AreaDetail} path="/areas/:id" />
      <${AreaCreate} path="/areas/new" />
      <${AreaEdit} path="/areas/:id/edit" />
      <${AreaGroupList} path="/area-groups" />
      <${AreaGroupDetail} path="/area-groups/:id" />
      <${AreaGroupCreate} path="/area-groups/new" />
      <${AreaGroupEdit} path="/area-groups/:id/edit" />
      <${ItemList} path="/items" />
      <${ItemDetail} path="/items/:id" />
      <${ItemCreate} path="/items/new" />
      <${ItemEdit} path="/items/:id/edit" />
      <${ItemPartCreate} path="/item-parts/new" />
      <${ItemPartDetail} path="/item-parts/:id" />
      <${ItemPartEdit} path="/item-parts/:id/edit" />
      <${Placeholder} path="/export-import" title="Export/Import" />
    <//>
  </main>
`;

